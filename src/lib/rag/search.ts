import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"
import { searchChunks } from "./db"
import { searchSefaria, fetchSefariaText } from "./sefaria"
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
  const gatewayKey = process.env.AI_GATEWAY_API_KEY

  if (!gatewayKey) {
    return fallbackTranslation(portugueseQuery)
  }

  try {
    const google = createGoogleGenerativeAI({
      apiKey: gatewayKey,
      baseURL: "https://gateway.ai.cloudflare.com/v1",
    })

    const model = google("gemini-2.5-flash-latest")

    const prompt = `You are a translator for Jewish text search. Translate this Portuguese question into English and Hebrew search keywords that would match Jewish religious texts (Torah, Talmud, Mishnah, Halacha, etc.).

Portuguese question: "${portugueseQuery}"

Return ONLY the search keywords in English and Hebrew, separated by spaces. Include both transliterations and Hebrew script. Keep it concise (max 20 words).

Example input: "O que é Shabat?"
Example output: shabbat sabbath שבת rest holy day seventh

Your translation:`

    const { text } = await generateText({
      model,
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
      const results = await searchSefaria(translatedQuery, {
        limit: matchCount,
      })

      const chunks: SefariaChunk[] = []

      for (const result of results.slice(0, matchCount)) {
        const textData = await fetchSefariaText(result.ref)

        if (textData && textData.versionTitle) {
          chunks.push({
            id: 0,
            ref: textData.ref,
            he_ref: textData.heRef,
            book: textData.ref.split(" ")[0],
            category: textData.categories?.[0] || null,
            language: result.lang,
            version_title: textData.versionTitle,
            license: textData.license || null,
            sefaria_url: `https://www.sefaria.org/${textData.ref.replace(/\s+/g, "_").replace(/:/g, ".")}`,
            text_content: result.text,
          })
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
