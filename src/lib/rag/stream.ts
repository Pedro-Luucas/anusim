import type { SefariaChunk } from "./db"
import { verifyCitations, chunksToCitations } from "./citations"
import { sanitizeDashes } from "./sanitize"

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
  fullStream: AsyncIterable<{ type: string; text?: string; error?: unknown; [key: string]: unknown }>,
  fullText: string | Promise<string> | PromiseLike<string>,
  retrievedChunks: SefariaChunk[]
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder()
  const citations = chunksToCitations(retrievedChunks)

  return new ReadableStream({
    async start(controller) {
      try {
        let fullTextContent = ""

        for await (const part of fullStream) {
          if (part.type === "text-delta" && part.text) {
            const sanitized = sanitizeDashes(part.text)
            fullTextContent += part.text
            const event: StreamEvent = { type: "text", delta: sanitized }
            controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"))
          } else if (part.type === "error") {
            console.error("[Stream] Model error:", part.error)
            const errorEvent: StreamEvent = {
              type: "error",
              message: "Erro ao processar sua pergunta. Tente novamente.",
            }
            controller.enqueue(encoder.encode(JSON.stringify(errorEvent) + "\n"))
            controller.close()
            return
          }
        }

        const { verified, hallucinated } = verifyCitations(
          fullTextContent,
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

        const uniqueCitations = Array.from(
          new Map(verifiedCitations.map((c) => [c.ref, c])).values()
        )

        if (uniqueCitations.length > 0) {
          const items: VerifiedCitation[] = uniqueCitations.map((c) => ({
            ref: c.ref,
            heRef: c.heRef,
            url: c.url,
            versionTitle: c.versionTitle,
            license: c.license,
            excerpt: sanitizeDashes(c.text.substring(0, 200)),
            heExcerpt: c.heText ? sanitizeDashes(c.heText.substring(0, 200)) : undefined,
          }))

          const event: StreamEvent = { type: "citations", items }
          controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"))
        }

        const doneEvent: StreamEvent = { type: "done" }
        controller.enqueue(encoder.encode(JSON.stringify(doneEvent) + "\n"))
        controller.close()
      } catch (error) {
        console.error("[Stream] Error during streaming:", error)
        const errorEvent: StreamEvent = {
          type: "error",
          message: "Erro ao processar sua pergunta. Tente novamente.",
        }
        controller.enqueue(encoder.encode(JSON.stringify(errorEvent) + "\n"))
        controller.close()
      }
    },
    cancel() {
      console.log("[Stream] Client cancelled the stream")
    },
  })
}
