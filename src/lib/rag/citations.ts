import type { SefariaChunk } from "./db"

export type Citation = {
  ref: string
  heRef?: string
  book: string
  language: string
  versionTitle: string
  license?: string
  url: string
  text: string
  heText?: string
}

export function verifyCitations(
  fullText: string,
  retrievedChunks: SefariaChunk[]
): {
  verified: string[]
  hallucinated: string[]
} {
  const normalizedText = fullText.toLowerCase()
  const verified: string[] = []
  const hallucinated: string[] = []

  const citedRefs = new Set<string>()

  for (const chunk of retrievedChunks) {
    const chunkNormalized = normalizeRef(chunk.ref)
    const refVariants = [
      chunk.ref.toLowerCase(),
      chunkNormalized,
      chunk.ref.toLowerCase().replace(/\s+/g, ""),
    ]

    if (refVariants.some((variant) => normalizedText.includes(variant))) {
      if (!citedRefs.has(chunkNormalized)) {
        citedRefs.add(chunkNormalized)
        verified.push(chunk.ref)
      }
    }
  }

  const extractedRefs = extractRefsFromText(fullText)
  for (const ref of extractedRefs) {
    const normalized = normalizeRef(ref)
    if (!citedRefs.has(normalized)) {
      hallucinated.push(ref)
    }
  }

  return { verified, hallucinated }
}

const PORTUGUESE_BOOK_NAMES: Record<string, string> = {
  "gênesis": "Genesis",
  "genesis": "Genesis",
  "êxodo": "Exodus",
  "exodo": "Exodus",
  "levítico": "Leviticus",
  "levitico": "Leviticus",
  "números": "Numbers",
  "numeros": "Numbers",
  "deuteronômio": "Deuteronomy",
  "deuteronomio": "Deuteronomy",
}

function normalizeRef(ref: string): string {
  let normalized = ref
    .replace(/\s+/g, " ")
    .replace(/[:\-–—]/g, ".")
    .toLowerCase()
    .trim()

  for (const [pt, en] of Object.entries(PORTUGUESE_BOOK_NAMES)) {
    if (normalized.startsWith(pt + " ")) {
      normalized = normalized.replace(pt, en.toLowerCase())
      break
    }
  }

  return normalized
}

export function chunksToCitations(chunks: SefariaChunk[]): Citation[] {
  return chunks.map((chunk) => ({
    ref: chunk.ref,
    heRef: chunk.he_ref || undefined,
    book: chunk.book,
    language: chunk.language,
    versionTitle: chunk.version_title,
    license: chunk.license || undefined,
    url: chunk.sefaria_url,
    text: chunk.text_content,
    heText: chunk.he_text || undefined,
  }))
}

export function extractRefsFromText(text: string): string[] {
  const refPattern = /(?:Gênesis|Êxodo|Levítico|Números|Deuteronômio|Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Bereshit|Shemot|Vayikra|Bamidbar|Devarim|Berakhot|Shabbat|Pesachim|Rosh Hashanah|Yoma|Sukkah|Taanit|Megillah|Moed Katan|Chagigah|Yevamot|Ketubot|Nedarim|Nazir|Sotah|Gittin|Kiddushin|Bava Kamma|Bava Metzia|Bava Batra|Sanhedrin|Makkot|Shevuot|Avodah Zarah|Horayot|Zevachim|Menachot|Hullin|Bekhorot|Arakhin|Temurah|Keritot|Meilah|Tamid|Middot|Kinnim|Niddah|Avot|Pirkei Avot|Rashi on [A-Za-z]+|Mishneh Torah(?:,\s+[A-Za-z\s]+)?|Shulchan Arukh(?:,\s+[A-Za-z\s]+)?|Kaf HaChaim|Ben Ish Chai|Bereshit Rabbah|Shemot Rabbah|Vayikra Rabbah|Bamidbar Rabbah|Devarim Rabbah)\s+\d+(?:[:.]\d+)?[ab]?(?:[:.]\d+[ab]?)?/gi

  const matches = text.match(refPattern)
  return matches ? Array.from(new Set(matches)) : []
}

export function formatCitationForDisplay(citation: Citation): string {
  const parts = [
    `**${citation.ref}**`,
    citation.versionTitle,
    citation.license ? `(${citation.license})` : null,
  ].filter(Boolean)

  return parts.join(" • ")
}
