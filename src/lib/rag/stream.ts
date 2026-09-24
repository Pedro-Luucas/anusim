import { streamText } from "ai"
import type { SefariaChunk } from "./db"
import { extractRefsFromText, verifyCitations, chunksToCitations } from "./citations"
import type { Citation } from "./citations"

export type StreamEvent =
  | { type: "text"; delta: string }
  | { type: "citations"; items: VerifiedCitation[] }
  | { type: "done" }
  | { type: "error"; message: string }

export type VerifiedCitation = {
  ref: string
  heRef?: string
  url: string
  versionTitle: string
  license?: string
  excerpt: string
  heExcerpt?: string
}

export async function createChatStream(
  textStream: AsyncIterable<string>,
  fullText: string | Promise<string> | PromiseLike<string>,
  retrievedChunks: SefariaChunk[]
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder()
  const citations = chunksToCitations(retrievedChunks)

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const delta of textStream) {
          const event: StreamEvent = { type: "text", delta }
          controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"))
        }

        const text = await fullText
        const generatedRefs = extractRefsFromText(text)
        const { verified, hallucinated } = verifyCitations(
          generatedRefs,
          retrievedChunks
        )

        if (hallucinated.length > 0) {
          console.warn(
            `[Stream] ${hallucinated.length} unverified citations:`,
            hallucinated
          )
        }

        const verifiedCitations = citations.filter((c) =>
          verified.some(
            (vRef) =>
              c.ref.toLowerCase().replace(/[:\s]/g, ".") ===
              vRef.toLowerCase().replace(/[:\s]/g, ".")
          )
        )

        if (verifiedCitations.length > 0) {
          const items: VerifiedCitation[] = verifiedCitations.map((c) => ({
            ref: c.ref,
            heRef: c.heRef,
            url: c.url,
            versionTitle: c.versionTitle,
            license: c.license,
            excerpt: c.text.substring(0, 200),
            heExcerpt: c.heRef ? c.text.substring(0, 200) : undefined,
          }))

          const event: StreamEvent = { type: "citations", items }
          controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"))
        }

        const doneEvent: StreamEvent = { type: "done" }
        controller.enqueue(encoder.encode(JSON.stringify(doneEvent) + "\n"))
        controller.close()
      } catch (error) {
        const errorEvent: StreamEvent = {
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Erro ao processar sua pergunta.",
        }
        controller.enqueue(encoder.encode(JSON.stringify(errorEvent) + "\n"))
        controller.close()
      }
    },
  })
}
