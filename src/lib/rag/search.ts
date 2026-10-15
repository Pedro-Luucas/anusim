import { generateText } from "ai"
import { searchChunks } from "./db"
import { searchSefaria, fetchSefariaText, isLicenseAllowed, stripHtml, buildSefariaUrl } from "./sefaria"
import { embedText } from "./embeddings"
import type { SefariaChunk } from "./db"
import { describeError, getChatModel, isChatConfigured } from "./llm"

export type SearchResult = {
  chunks: SefariaChunk[]
  query: string
  translatedQuery: string
  source: "database" | "sefaria_api"
}

export type QueryPlan = {
  terms: string
  refs: string[]
}

const PLAN_PROMPT = (q: string) => `You help search Sefaria (Jewish texts) for a question written in Portuguese.

Question: "${q}"

Return ONLY a JSON object, no prose, no code fences, with:
- "terms": concise English search keywords plus the main Hebrew term (max 12 words)
- "refs": up to 5 canonical Sefaria refs (English titles) most likely to answer it, preferring Torah/Tanakh verses, Babylonian Talmud, Mishnah, Mishneh Torah and Shulchan Arukh (Sephardic authorities first). Use ranges like "Genesis 2:1-3" or "Exodus 20:8-11". Only refs you are confident exist.

Example: {"terms":"shabbat sabbath rest seventh day שבת","refs":["Genesis 2:1-3","Exodus 20:8-11","Deuteronomy 5:12-15","Mishneh Torah, Sabbath 30:1"]}`

export function parseQueryPlan(text: string): QueryPlan | null {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return null
  try {
    const data = JSON.parse(match[0]) as { terms?: unknown; refs?: unknown }
    const terms = typeof data.terms === "string" ? data.terms.trim() : ""
    const refs = Array.isArray(data.refs)
      ? data.refs.filter((r): r is string => typeof r === "string" && r.trim().length > 0).map((r) => r.trim()).slice(0, 5)
      : []
    if (!terms && refs.length === 0) return null
    return { terms, refs }
  } catch {
    return null
  }
}

export async function planQuery(portugueseQuery: string): Promise<QueryPlan> {
  const fallback = { terms: fallbackTranslation(portugueseQuery), refs: [] }
  if (!isChatConfigured()) return fallback
  try {
    const { text } = await generateText({
      model: getChatModel(),
      prompt: PLAN_PROMPT(portugueseQuery),
    })
    const plan = parseQueryPlan(text)
    if (!plan) return fallback
    return { terms: plan.terms || fallback.terms, refs: plan.refs }
  } catch (error) {
    console.warn("[Search] Query planning failed, using fallback:", describeError(error))
    return fallback
  }
}

export async function translateQueryToSearchTerms(portugueseQuery: string): Promise<string> {
  return (await planQuery(portugueseQuery)).terms
}

/** Sefaria search paths allowed in the live fallback, in priority order. */
export const FALLBACK_PATHS = [
  "Tanakh",
  "Talmud/Bavli",
  "Mishnah",
  "Halakhah",
  "Midrash",
  "Talmud/Yerushalmi",
]

const EXCLUDED_CATEGORIES = ["Reference", "Liturgy", "Minor Tractates"]
const SEPHARDIC_HINTS = ["Shulchan Arukh", "Mishneh Torah", "Kaf HaChaim", "Ben Ish Chai", "Rif"]

export function isAllowedSource(ref: string, categories: string[] = []): boolean {
  if (categories.some((c) => EXCLUDED_CATEGORIES.includes(c))) return false
  if (/dictionary|siddur|machzor|haggadah/i.test(ref)) return false
  if (categories.length === 0) return true
  const allowedRoots = ["Tanakh", "Mishnah", "Talmud", "Midrash", "Halakhah"]
  return allowedRoots.includes(categories[0])
}

export function sourcePriority(ref: string, categories: string[] = []): number {
  const path = categories.join("/")
  if (/^Tanakh\/(Torah|Prophets|Writings)/.test(path) || path === "Tanakh") return 0
  if (SEPHARDIC_HINTS.some((h) => ref.startsWith(h))) return 1
  if (path.startsWith("Talmud/Bavli") && !path.includes("Commentary")) return 2
  if (path.startsWith("Mishnah") && !path.includes("Commentary")) return 3
  if (path.startsWith("Halakhah")) return 4
  if (path.startsWith("Midrash")) return 5
  if (/Commentary|Rishonim/.test(path)) return 6
  if (path.startsWith("Talmud/Yerushalmi")) return 7
  return 8
}

function fallbackTranslation(portugueseQuery: string): string {
  const portugueseStopwords = new Set([
    "por", "que", "o", "a", "de", "do", "da", "e", "no", "na", "os", "as", 
    "um", "uma", "com", "para", "é", "são", "mais", "em", "ao", "aos"
  ])
  
  const commonTerms: Record<string, string> = {
    "shabat": "shabbat sabbath שבת",
    "sábado": "shabbat sabbath שבת",
    "torá": "torah תורה",
    "torah": "torah תורה",
    "kashrut": "kashrut kosher כשרות",
    "kosher": "kashrut kosher כשרות",
    "tefilá": "tefillah prayer תפילה",
    "oração": "tefillah prayer תפילה",
    "talmud": "talmud gemara תלמוד",
    "mishná": "mishnah משנה",
    "mishnah": "mishnah משנה",
    "halacá": "halacha halakhah הלכה",
    "halachá": "halacha halakhah הלכה",
    "mitzvá": "mitzvah commandment מצוה",
    "mandamento": "mitzvah commandment מצוה",
    "pessach": "pesach passover פסח",
    "páscoa judaica": "pesach passover פסח",
    "rosh hashaná": "rosh hashanah new year ראש השנה",
    "yom kipur": "yom kippur יום כיפור",
    "sucot": "sukkot סוכות",
    "chanucá": "chanukah hanukkah חנוכה",
    "purim": "purim פורים",
    "shavuot": "shavuot שבועות",
    "teshuvá": "teshuvah repentance תשובה",
    "tzedaká": "tzedakah charity צדקה",
    "caridade": "tzedakah charity צדקה",
  }

  let translated = portugueseQuery.toLowerCase()

  for (const [pt, en] of Object.entries(commonTerms)) {
    const regex = new RegExp(`\\b${pt}\\b`, "gi")
    translated = translated.replace(regex, en)
  }

  const words = translated.split(/\s+/)
  const filtered = words.filter(word => 
    word.length > 2 && !portugueseStopwords.has(word.toLowerCase())
  )

  return filtered.join(" ") || portugueseQuery
}

export async function searchForQuery(
  query: string,
  options: {
    useDatabase?: boolean
    useFallback?: boolean
    matchCount?: number
  } = {}
): Promise<SearchResult> {
  const {
    useDatabase = true,
    useFallback = true,
    matchCount = 10,
  } = options

  const plan = await planQuery(query)
  const translatedQuery = plan.terms

  if (useDatabase) {
    try {
      const { embedding } = await embedText(translatedQuery)

      const chunks = await searchChunks(embedding, translatedQuery, {
        matchCount,
        matchThreshold: 0.3,
        vectorWeight: 0.7,
      })

      if (chunks.length > 0) {
        return {
          chunks,
          query,
          translatedQuery,
          source: "database",
        }
      }
    } catch (error) {
      console.error("[RAG] Database/embedding search failed, falling back to Sefaria:", describeError(error))
      
      if (error instanceof Error && error.message.includes("AI_GATEWAY_API_KEY")) {
        console.log("[RAG] Gateway not configured, skipping database search")
      }
    }
  }

  if (useFallback) {
    try {
      const chunks = await liveSefariaSearch(plan, matchCount)
      return { chunks, query, translatedQuery, source: "sefaria_api" }
    } catch (error) {
      console.error("[RAG] Sefaria API fallback failed:", describeError(error))
    }
  }

  return {
    chunks: [],
    query,
    translatedQuery,
    source: "database",
  }
}

function textToString(text: unknown): string {
  if (Array.isArray(text)) return text.map(textToString).join(" ")
  return typeof text === "string" ? text : String(text ?? "")
}

async function fetchChunk(ref: string): Promise<SefariaChunk | null> {
  const textData = await fetchSefariaText(ref).catch(() => null)
  if (!textData?.versions?.length) return null
  if (!isAllowedSource(textData.ref, textData.categories)) return null

  const enVersions = textData.versions.filter(
    (v) => v.language === "en" && isLicenseAllowed(v.license)
  )
  const primaryEnVersion =
    enVersions.find((v) => !v.versionTitle.toLowerCase().includes("english explanation")) ||
    enVersions[0]
  if (!primaryEnVersion) return null
  const heVersion = textData.versions.find(
    (v) => v.language === "he" && isLicenseAllowed(v.license)
  )

  const enText = stripHtml(textToString(primaryEnVersion.text))
  if (!enText) return null
  const heText = heVersion ? stripHtml(textToString(heVersion.text)) : null

  return {
    id: 0,
    ref: textData.ref,
    he_ref: textData.heRef,
    book: textData.ref.split(/[,\s]/)[0],
    category: textData.categories?.[0] || null,
    language: "en",
    version_title: primaryEnVersion.versionTitle,
    license: primaryEnVersion.license || null,
    sefaria_url: buildSefariaUrl(textData.ref),
    text_content: enText.slice(0, 2500),
    he_text: heText ? heText.slice(0, 2500) : null,
  }
}

/**
 * Live Sefaria fallback: fetches the canonical refs suggested by the model
 * directly, then merges category-restricted search hits (Tanakh, Bavli,
 * Mishnah, Halakhah, Midrash), skipping dictionaries, liturgy and
 * copyrighted/unknown-license versions.
 */
export async function liveSefariaSearch(plan: QueryPlan, matchCount: number): Promise<SefariaChunk[]> {
  const keywords = plan.terms.split(/\s+/).filter((k) => k.length > 2)
  const englishTerms = keywords.filter((k) => !/[\u0590-\u05FF]/.test(k))
  const hebrewTerms = keywords.filter((k) => /[\u0590-\u05FF]/.test(k))
  const queries = [englishTerms.slice(0, 4).join(" "), hebrewTerms.slice(0, 1).join(" ")].filter(
    (q) => q.trim().length > 0
  )

  const [directChunks, searchHits] = await Promise.all([
    Promise.all(plan.refs.map(fetchChunk)),
    Promise.all(
      queries.map((q) =>
        searchSefaria(q, { limit: 20, filters: FALLBACK_PATHS }).catch((error) => {
          console.warn("[RAG] Sefaria search failed:", describeError(error))
          return []
        })
      )
    ),
  ])

  const seen = new Set<string>()
  const chunks: SefariaChunk[] = []
  for (const c of directChunks) {
    if (c && !seen.has(c.ref)) {
      seen.add(c.ref)
      chunks.push(c)
    }
  }

  const hits = Array.from(new Map(searchHits.flat().map((h) => [h.ref, h])).values())
    .filter((h) => h.ref && !seen.has(h.ref))
    .filter((h) => isAllowedSource(h.ref, h.path?.split("/") ?? []))
    .sort(
      (a, b) =>
        sourcePriority(a.ref, a.path?.split("/") ?? []) -
        sourcePriority(b.ref, b.path?.split("/") ?? [])
    )

  const remaining = Math.max(0, matchCount - chunks.length)
  const candidates = hits.slice(0, remaining + 4)
  const fetched = await Promise.all(candidates.map((h) => fetchChunk(h.ref)))
  for (const c of fetched) {
    if (chunks.length >= matchCount) break
    if (c && !seen.has(c.ref)) {
      seen.add(c.ref)
      chunks.push(c)
    }
  }

  return chunks
}
