export type SefariaSearchResult = {
  ref: string
  heRef: string
  text: string
  lang: string
}

export type SefariaTextResponse = {
  ref: string
  heRef: string
  text: string | string[]
  he: string | string[]
  versionTitle?: string
  versionTitleInHebrew?: string
  license?: string
  categories?: string[]
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
  const normalized = ref.replace(/\s+/g, "_").replace(/:/g, ".")
  return `https://www.sefaria.org/${normalized}`
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

  return hits.map((hit: Record<string, unknown>) => ({
    ref: hit._source?.ref || "",
    heRef: hit._source?.heRef || "",
    text: stripHtml((hit._source?.exact || hit._source?.naive_lemmatizer || "") as string),
    lang: (hit._source?.lang || "en") as string,
  }))
}

export async function fetchSefariaText(
  ref: string,
  options: {
    context?: number
  } = {}
): Promise<SefariaTextResponse | null> {
  const { context = 1 } = options

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

  const textArray = Array.isArray(data.text) ? data.text : [data.text]
  const heArray = Array.isArray(data.he) ? data.he : [data.he]

  const text = textArray.map(stripHtml).join(" ")
  const he = heArray.map(stripHtml).join(" ")

  return {
    ref: data.ref || ref,
    heRef: data.heRef || "",
    text,
    he,
    versionTitle: data.versionTitle,
    versionTitleInHebrew: data.versionTitleInHebrew,
    license: data.license,
    categories: data.categories,
  }
}

export async function fetchBookIndex(title: string) {
  const url = `https://www.sefaria.org/api/v2/index/${encodeURIComponent(title)}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch index for ${title}: ${response.statusText}`)
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
    versionTitle: string
    license: string
    categories: string[]
  }>
> {
  const index = await fetchBookIndex(title)

  const lengths = index.lengths || []
  const schema = index.schema

  const segments: Array<{
    ref: string
    heRef: string
    text: string
    versionTitle: string
    license: string
    categories: string[]
  }> = []

  async function fetchSection(sectionRef: string) {
    const text = await fetchSefariaText(sectionRef, { context: 0 })

    if (
      !text ||
      !text.versionTitle ||
      !isLicenseAllowed(text.license)
    ) {
      return
    }

    const textContent = text.text

    const textArray = Array.isArray(textContent)
      ? textContent
      : [textContent]

    textArray.forEach((segment, idx) => {
      if (!segment || segment.trim().length === 0) return

      const segmentRef =
        textArray.length > 1 ? `${sectionRef}:${idx + 1}` : sectionRef

      segments.push({
        ref: segmentRef,
        heRef: text.heRef,
        text: stripHtml(segment),
        versionTitle: text.versionTitle || "Unknown",
        license: text.license || "Unknown",
        categories: text.categories || [],
      })
    })
  }

  if (schema?.sectionNames?.length === 1) {
    for (let i = 1; i <= lengths[0]; i++) {
      await fetchSection(`${title} ${i}`)
    }
  } else if (schema?.sectionNames?.length === 2) {
    for (let chapter = 1; chapter <= lengths[0]; chapter++) {
      await fetchSection(`${title} ${chapter}`)
    }
  }

  return segments
}
