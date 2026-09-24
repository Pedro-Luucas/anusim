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
  generatedRefs: string[],
  retrievedChunks: SefariaChunk[]
): {
  verified: string[]
  hallucinated: string[]
} {
  const retrievedRefs = new Set(
    retrievedChunks.map((chunk) => normalizeRef(chunk.ref))
  )

  const verified: string[] = []
  const hallucinated: string[] = []

  for (const ref of generatedRefs) {
    const normalized = normalizeRef(ref)
    if (retrievedRefs.has(normalized)) {
      verified.push(ref)
    } else {
      hallucinated.push(ref)
    }
  }

  return { verified, hallucinated }
}

function normalizeRef(ref: string): string {
  return ref
    .replace(/\s+/g, " ")
    .replace(/[:\-–—]/g, ".")
    .toLowerCase()
    .trim()
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
