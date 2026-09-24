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
  const commonTerms: Record<string, string> = {
    "shabat": "shabbat sabbath",
    "sábado": "shabbat sabbath",
    "torá": "torah",
    "torah": "torah",
    "kashrut": "kashrut kosher",
    "kosher": "kashrut kosher",
    "tefilá": "tefillah prayer",
    "oração": "tefillah prayer",
    "talmud": "talmud gemara",
    "mishná": "mishnah",
    "mishnah": "mishnah",
    "halacá": "halacha halakhah",
    "halachá": "halacha halakhah",
    "mitzvá": "mitzvah commandment",
    "mandamento": "mitzvah commandment",
    "pessach": "pesach passover",
    "páscoa judaica": "pesach passover",
    "rosh hashaná": "rosh hashanah new year",
    "yom kipur": "yom kippur",
    "sucot": "sukkot",
    "chanucá": "chanukah hanukkah",
    "purim": "purim",
    "shavuot": "shavuot",
  }

  let translated = portugueseQuery.toLowerCase()

  for (const [pt, en] of Object.entries(commonTerms)) {
    const regex = new RegExp(`\\b${pt}\\b`, "gi")
    translated = translated.replace(regex, en)
  }

  return translated
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
