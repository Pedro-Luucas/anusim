export type SefariaSearchResult = {
  ref: string
  heRef: string
  text: string
  lang: string
}

export type SefariaTextResponse = {
  ref: string
  heRef: string
  versions: Array<{
    text: string | string[]
    language: string
    versionTitle: string
    license: string
  }>
  categories?: string[]
}

export type SefariaShapeResponse = {
  shape: Array<number | Array<number>>
  section_names: string[]
  address_types: string[]
}

const ALLOWED_LICENSES = [
  "Public Domain",
  "CC0",
  "CC-BY",
  "CC-BY-SA",
  "CC-BY-NC",
]

export function isLicenseAllowed(license: string | undefined): boolean {
  if (!license) return false
  return ALLOWED_LICENSES.some((allowed) =>
    license.toLowerCase().includes(allowed.toLowerCase())
  )
}

export function stripHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

export function buildSefariaUrl(ref: string): string {
  const parts = ref.trim().split(/\s+/)
  
  if (parts.length < 2) {
    return `https://www.sefaria.org/${ref.replace(/\s+/g, "_")}`
  }
  
  const lastPart = parts[parts.length - 1]
  
  if (/^\d+/.test(lastPart)) {
    const bookName = parts.slice(0, -1).join("_")
    const citation = lastPart.replace(/:/g, ".")
    return `https://www.sefaria.org/${bookName}.${citation}`
  }
  
  return `https://www.sefaria.org/${ref.replace(/\s+/g, "_").replace(/:/g, ".")}`
}

export async function searchSefaria(
  query: string,
  options: {
    limit?: number
    filters?: string[]
  } = {}
): Promise<SefariaSearchResult[]> {
  const { limit = 10, filters = [] } = options

  const body = {
    query,
    size: limit,
    type: "text",
    filters: filters.length > 0 ? filters : undefined,
  }

  const response = await fetch("https://www.sefaria.org/api/search-wrapper", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Sefaria search failed: ${response.statusText}`)
  }

  const data = await response.json()
  const hits = data.hits?.hits || []

  type SefariaSearchHit = {
    _source?: {
      ref?: string
      heRef?: string
      exact?: string
      naive_lemmatizer?: string
      lang?: string
    }
  }

  return hits.map((hit: SefariaSearchHit) => ({
    ref: (hit._source?.ref || "") as string,
    heRef: (hit._source?.heRef || "") as string,
    text: stripHtml(((hit._source?.exact || hit._source?.naive_lemmatizer || "") as string)),
    lang: ((hit._source?.lang || "en") as string),
  }))
}

export async function fetchSefariaText(
  ref: string,
  options: {
    context?: number
  } = {}
): Promise<SefariaTextResponse | null> {
  const { context = 0 } = options

  const params = new URLSearchParams({
    context: context.toString(),
  })

  const url = `https://www.sefaria.org/api/v3/texts/${encodeURIComponent(ref)}?${params}`

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error(`Sefaria API error: ${response.statusText}`)
  }

  const data = await response.json()

  if (!data.versions || !Array.isArray(data.versions)) {
    return null
  }

  return {
    ref: data.ref || ref,
    heRef: data.heRef || "",
    versions: data.versions.map((v: {
      text: string | string[]
      language: string
      versionTitle: string
      license: string
    }) => ({
      text: v.text,
      language: v.language,
      versionTitle: v.versionTitle,
      license: v.license,
    })),
    categories: data.categories,
  }
}

export async function fetchBookShape(title: string): Promise<SefariaShapeResponse | null> {
  const url = `https://www.sefaria.org/api/shape/${encodeURIComponent(title)}`

  const response = await fetch(url)

  if (!response.ok) {
    return null
  }

  return response.json()
}

export async function fetchAllSegments(
  title: string
): Promise<
  Array<{
    ref: string
    heRef: string
    text: string
    heText: string
    versionTitle: string
    license: string
    categories: string[]
  }>
> {
  const shape = await fetchBookShape(title)

  if (!shape) {
    throw new Error(`Failed to fetch shape for ${title}`)
  }

  const segments: Array<{
    ref: string
    heRef: string
    text: string
    heText: string
    versionTitle: string
    license: string
    categories: string[]
  }> = []

  async function fetchAndParseSection(sectionRef: string) {
    const textResponse = await fetchSefariaText(sectionRef, { context: 0 })

    if (!textResponse || !textResponse.versions) {
      return
    }

    const enVersion = textResponse.versions.find(
      (v) => v.language === "en" && isLicenseAllowed(v.license)
    )

    const heVersion = textResponse.versions.find(
      (v) => v.language === "he" && isLicenseAllowed(v.license)
    )

    if (!enVersion) {
      return
    }

    const enTexts = Array.isArray(enVersion.text) ? enVersion.text : [enVersion.text]
    const heTexts = heVersion && Array.isArray(heVersion.text) 
      ? heVersion.text 
      : heVersion 
        ? [heVersion.text] 
        : []

    enTexts.forEach((enText, idx) => {
      if (!enText || stripHtml(enText).trim().length === 0) return

      const segmentRef = enTexts.length > 1 ? `${sectionRef}:${idx + 1}` : sectionRef

      const heText = heTexts[idx]
      const heTextStr = typeof heText === "string" ? heText : ""

      segments.push({
        ref: segmentRef,
        heRef: textResponse.heRef,
        text: stripHtml(enText),
        heText: heTextStr ? stripHtml(heTextStr) : "",
        versionTitle: enVersion.versionTitle,
        license: enVersion.license || "Unknown",
        categories: textResponse.categories || [],
      })
    })
  }

  const shapeArray = Array.isArray(shape.shape[0]) ? shape.shape : [shape.shape]
  
  if (shape.section_names.length === 1) {
    const firstElement = shapeArray[0]
    const maxSection = typeof firstElement === "number" 
      ? firstElement 
      : Array.isArray(firstElement) 
        ? firstElement[0] 
        : 0
    
    if (typeof maxSection === "number") {
      for (let i = 1; i <= maxSection; i++) {
        await fetchAndParseSection(`${title} ${i}`)
      }
    }
  } else if (shape.section_names.length === 2) {
    for (let chapter = 1; chapter <= shapeArray.length; chapter++) {
      await fetchAndParseSection(`${title} ${chapter}`)
    }
  }

  return segments
}
