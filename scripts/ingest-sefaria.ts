import {
  fetchAllSegments,
  isLicenseAllowed,
  buildSefariaUrl,
} from "../src/lib/rag/sefaria"
import { embedText } from "../src/lib/rag/embeddings"
import { upsertChunk, getChunkCount } from "../src/lib/rag/db"

const SEFARIA_TITLES = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Rashi on Genesis",
  "Rashi on Exodus",
  "Rashi on Leviticus",
  "Rashi on Numbers",
  "Rashi on Deuteronomy",
  "Pirkei Avot",
  "Mishnah Berakhot",
  "Berakhot",
  "Mishneh Torah, Laws of Repentance",
  "Mishneh Torah, Foundations of the Torah",
  "Shulchan Arukh, Orach Chayim",
  "Bereshit Rabbah",
]

const DRY_RUN = process.env.DRY_RUN === "true"
const BATCH_SIZE = 10
const DELAY_MS = 1000

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function chunkSegments(
  segments: Array<{
    ref: string
    heRef: string
    text: string
    heText: string
    versionTitle: string
    license: string
    categories: string[]
  }>,
  minLength = 50
): typeof segments {
  const chunked: typeof segments = []
  let buffer: typeof segments[0] | null = null

  for (const segment of segments) {
    if (segment.text.length < minLength && buffer) {
      buffer.text += " " + segment.text
      buffer.heText += " " + segment.heText
      const refParts = segment.ref.split(/[\s:]+/)
      const lastPart = refParts[refParts.length - 1]
      const bufferParts = buffer.ref.split("-")
      const startRef = bufferParts[0]
      buffer.ref = `${startRef}-${lastPart}`
    } else {
      if (buffer) {
        chunked.push(buffer)
      }
      buffer = { ...segment }
    }
  }

  if (buffer) {
    chunked.push(buffer)
  }

  return chunked
}

async function ingestTitle(title: string): Promise<number> {
  console.log(`\n[${title}] Fetching segments...`)

  try {
    const segments = await fetchAllSegments(title)

    console.log(
      `[${title}] Found ${segments.length} segments (before chunking)`
    )

    if (segments.length === 0) {
      console.log(`[${title}] No segments with allowed licenses`)
      return 0
    }

    const chunked = chunkSegments(segments)
    console.log(`[${title}] Chunked into ${chunked.length} pieces`)

    const licensed = chunked.filter((seg) => isLicenseAllowed(seg.license))
    console.log(
      `[${title}] ${licensed.length} chunks have allowed licenses`
    )

    if (DRY_RUN) {
      console.log(`[${title}] DRY RUN - skipping embedding and upsert`)
      console.log(
        `[${title}] Sample:`,
        licensed[0]?.ref,
        "-",
        licensed[0]?.text.substring(0, 100)
      )
      return licensed.length
    }

    let inserted = 0

    for (let i = 0; i < licensed.length; i += BATCH_SIZE) {
      const batch = licensed.slice(i, i + BATCH_SIZE)

      for (const segment of batch) {
        try {
          const { embedding } = await embedText(segment.text)

          await upsertChunk({
            ref: segment.ref,
            he_ref: segment.heRef,
            book: title,
            category: segment.categories[0] || null,
            language: "en",
            version_title: segment.versionTitle,
            license: segment.license,
            sefaria_url: buildSefariaUrl(segment.ref),
            text_content: segment.text,
            embedding,
          })

          inserted++

          if (inserted % 10 === 0) {
            process.stdout.write(
              `\r[${title}] Inserted ${inserted}/${licensed.length}`
            )
          }
        } catch (error) {
          console.error(`\n[${title}] Failed to insert ${segment.ref}:`, error)
        }
      }

      if (i + BATCH_SIZE < licensed.length) {
        await sleep(DELAY_MS)
      }
    }

    console.log(`\n[${title}] ✓ Inserted ${inserted} chunks`)
    return inserted
  } catch (error) {
    console.error(`[${title}] Failed to fetch:`, error)
    return 0
  }
}

async function main() {
  console.log("=".repeat(60))
  console.log("Sefaria Ingestion Script")
  console.log("=".repeat(60))

  if (DRY_RUN) {
    console.log("🔍 DRY RUN MODE - No database writes will occur\n")
  }

  if (!DRY_RUN) {
    try {
      const count = await getChunkCount()
      console.log(`\nCurrent database: ${count} chunks\n`)
    } catch (error) {
      console.error(
        "\n⚠️  Cannot connect to database. Check env vars and migration status.\n"
      )
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.SUPABASE_SERVICE_ROLE_KEY
      ) {
        console.error("Missing: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
        process.exit(1)
      }
      throw error
    }
  }

  console.log(`Titles to ingest: ${SEFARIA_TITLES.length}\n`)

  let totalInserted = 0

  for (const title of SEFARIA_TITLES) {
    const inserted = await ingestTitle(title)
    totalInserted += inserted
    await sleep(DELAY_MS)
  }

  console.log("\n" + "=".repeat(60))
  console.log(`✓ Ingestion complete`)
  console.log(`Total chunks inserted: ${totalInserted}`)

  if (!DRY_RUN) {
    const finalCount = await getChunkCount()
    console.log(`Database now contains: ${finalCount} chunks`)
  }

  console.log("=".repeat(60))
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error)
  process.exit(1)
})
