import { generateText } from "ai"
import { searchChunks } from "./db"
import { searchSefaria, fetchSefariaText, isLicenseAllowed, stripHtml } from "./sefaria"
import { embedText } from "./embeddings"
import type { SefariaChunk } from "./db"

export type SearchResult = {
  chunks: SefariaChunk[]
  query: string
  translatedQuery: string
  source: "database" | "sefaria_api"
}

export async function translateQueryToSearchTerms(
  portugueseQuery: string
): Promise<string> {
  try {
    const modelId = process.env.CHAT_MODEL || "google/gemini-3.5-flash"

    const prompt = `You are a translator for Jewish text search. Translate this Portuguese question into English and Hebrew search keywords that would match Jewish religious texts (Torah, Talmud, Mishnah, Halacha, etc.).\n\nPortuguese question: "${portugueseQuery}"\n\nReturn ONLY the search keywords in English and Hebrew, separated by spaces. Include both transliterations and Hebrew script. Keep it concise (max 20 words).\n\nExample input: "O que é Shabat?"\nExample output: shabbat sabbath שבת rest holy day seventh\n\nYour translation:`

    const { text } = await generateText({
      model: modelId,
      prompt,
      temperature: 0.3,
    })

    return text.trim() || fallbackTranslation(portugueseQuery)
  } catch (error) {
    console.warn("[Search] Model translation failed, using fallback:", error)
    return fallbackTranslation(portugueseQuery)
  }
}

function fallbackTranslation(portugueseQuery: string): string {
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

  return translated || portugueseQuery
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

  const translatedQuery = await translateQueryToSearchTerms(query)

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
      console.error("[RAG] Database search failed:", error)
      
      if (error instanceof Error && error.message.includes("AI_GATEWAY_API_KEY")) {
        console.log("[RAG] Gateway not configured, skipping database search")
      }
    }
  }

  if (useFallback) {
    try {
      const keywords = translatedQuery.split(/\s+/).filter((k) => k.length > 2)
      
      const englishTerms = keywords.filter((k) => !/[\u0590-\u05FF]/.test(k))
      const hebrewTerms = keywords.filter((k) => /[\u0590-\u05FF]/.test(k))
      
      const primaryEnglish = englishTerms.slice(0, 1).join(" ")
      const primaryHebrew = hebrewTerms.slice(0, 1).join(" ")
      
      const queries = [
        primaryEnglish,
        primaryHebrew,
      ].filter(Boolean)

      const allResults = await Promise.all(
        queries.map((q) => searchSefaria(q, { limit: Math.ceil(matchCount / queries.length) }))
      )

      const flatResults = allResults.flat()
      const uniqueResults = Array.from(
        new Map(flatResults.map((r) => [r.ref, r])).values()
      )

      const chunks: SefariaChunk[] = []

      for (const result of uniqueResults.slice(0, matchCount)) {
        const textData = await fetchSefariaText(result.ref)

        if (textData && textData.versions && textData.versions.length > 0) {
          const enVersions = textData.versions.filter(
            (v) => v.language === "en" && isLicenseAllowed(v.license)
          )

          const primaryEnVersion = enVersions.find(
            (v) => !v.versionTitle.toLowerCase().includes('english explanation')
          ) || enVersions[0]

          const heVersion = textData.versions.find(
            (v) => v.language === "he" && isLicenseAllowed(v.license)
          )

          if (primaryEnVersion) {
            const enText = Array.isArray(primaryEnVersion.text) ? primaryEnVersion.text.join(" ") : primaryEnVersion.text
            const heText = heVersion && (Array.isArray(heVersion.text) ? heVersion.text.join(" ") : heVersion.text)

            chunks.push({
              id: 0,
              ref: textData.ref,
              he_ref: textData.heRef,
              book: textData.ref.split(" ")[0],
              category: textData.categories?.[0] || null,
              language: "en",
              version_title: primaryEnVersion.versionTitle,
              license: primaryEnVersion.license || null,
              sefaria_url: `https://www.sefaria.org/${textData.ref.replace(/\s+/g, "_").replace(/:/g, ".")}`,
              text_content: typeof enText === 'string' ? stripHtml(enText) : stripHtml(String(enText)),
              he_text: heText && typeof heText === 'string' ? stripHtml(heText) : (heText ? stripHtml(String(heText)) : null),
            })
          }
        }
      }

      return {
        chunks,
        query,
        translatedQuery,
        source: "sefaria_api",
      }
    } catch (error) {
      console.error("[RAG] Sefaria API fallback failed:", error)
    }
  }

  return {
    chunks: [],
    query,
    translatedQuery,
    source: "database",
  }
}
