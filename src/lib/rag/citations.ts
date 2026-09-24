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

function refMatches(textRef: string, chunkRef: string): boolean {
  const translatedTextRef = translatePortugueseBookName(textRef)
  const textNorm = normalizeRef(translatedTextRef)
  const chunkNorm = normalizeRef(chunkRef)
  
  if (textNorm === chunkNorm) {
    return true
  }
  
  const textParts = textNorm.split(".")
  const chunkParts = chunkNorm.split(".")
  
  if (textParts.length < chunkParts.length) {
    return false
  }
  
  for (let i = 0; i < chunkParts.length; i++) {
    if (textParts[i] !== chunkParts[i]) {
      return false
    }
  }
  
  const lastChunkPart = chunkParts[chunkParts.length - 1]
  if (/^\d+[ab]$/.test(lastChunkPart)) {
    return true
  }
  
  return textParts.length === chunkParts.length
}

export function verifyCitations(
  fullText: string,
  retrievedChunks: SefariaChunk[]
): {
  verified: string[]
  hallucinated: string[]
} {
  const verified: string[] = []
  const hallucinated: string[] = []
  const citedRefs = new Set<string>()

  const extractedRefs = extractRefsFromText(fullText)

  for (const chunk of retrievedChunks) {
    let foundMatch = false
    
    for (const extractedRef of extractedRefs) {
      if (refMatches(extractedRef, chunk.ref)) {
        const chunkNorm = normalizeRef(chunk.ref)
        if (!citedRefs.has(chunkNorm)) {
          citedRefs.add(chunkNorm)
          verified.push(chunk.ref)
        }
        foundMatch = true
        break
      }
    }
  }

  for (const extractedRef of extractedRefs) {
    let found = false
    
    for (const chunk of retrievedChunks) {
      if (refMatches(extractedRef, chunk.ref)) {
        found = true
        break
      }
    }
    
    if (!found) {
      hallucinated.push(extractedRef)
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
  "salmos": "Psalms",
  "provérbios": "Proverbs",
  "proverbios": "Proverbs",
  "isaías": "Isaiah",
  "isaias": "Isaiah",
}

function normalizeRef(ref: string): string {
  let normalized = ref
    .replace(/\s+/g, " ")
    .replace(/[:\-–]/g, ".")
    .toLowerCase()
    .trim()

  for (const [pt, en] of Object.entries(PORTUGUESE_BOOK_NAMES)) {
    const ptLower = pt.toLowerCase()
    const enLower = en.toLowerCase()
    const regex = new RegExp(`(^|\\s)(${ptLower})\\b`, "gi")
    normalized = normalized.replace(regex, `$1${enLower}`)
  }

  return normalized.trim()
}

function translatePortugueseBookName(text: string): string {
  let result = text
  for (const [pt, en] of Object.entries(PORTUGUESE_BOOK_NAMES)) {
    const regex = new RegExp(`(^|\\s)(${pt})\\b`, "gi")
    result = result.replace(regex, `$1${en}`)
  }
  return result
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
  const refPattern = /(?:^|\s)(?:Talmud\s+)?(?:Mishnah\s+)?(?:Rashi\s+on\s+)?(?:Gênesis|Êxodo|Levítico|Números|Deuteronômio|Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Bereshit|Shemot|Vayikra|Bamidbar|Devarim|Berakhot|Shabbat|Pesachim|Rosh Hashanah|Yoma|Sukkah|Taanit|Megillah|Moed Katan|Chagigah|Yevamot|Ketubot|Nedarim|Nazir|Sotah|Gittin|Kiddushin|Bava Kamma|Bava Metzia|Bava Batra|Sanhedrin|Makkot|Shevuot|Avodah Zarah|Horayot|Zevachim|Menachot|Hullin|Bekhorot|Arakhin|Temurah|Keritot|Meilah|Tamid|Middot|Kinnim|Niddah|Avot|Pirkei Avot|Psalms|Proverbs|Isaiah|Mishneh Torah(?:,\s+[A-Za-z\s]+)?|Shulchan Arukh(?:,\s+[A-Za-z\s]+)?|Shulchan Aruch(?:,\s+[A-Za-z\s]+)?|Kaf HaChaim|Ben Ish Chai|Bereshit Rabbah|Shemot Rabbah|Vayikra Rabbah|Bamidbar Rabbah|Devarim Rabbah)\s+\d+(?:[:\-.]\d+)?[ab]?(?:[:\-.]\d+[ab]?)?/gi

  const matches = text.match(refPattern)
  return matches ? Array.from(new Set(matches.map(m => m.trim()))) : []
}

export function formatCitationForDisplay(citation: Citation): string {
  const parts = [
    `**${citation.ref}**`,
    citation.versionTitle,
    citation.license ? `(${citation.license})` : null,
  ].filter(Boolean)

  return parts.join(" • ")
}
