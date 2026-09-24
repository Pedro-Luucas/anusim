import { describe, it, expect } from "vitest"
import { createChatStream } from "../src/lib/rag/stream"
import type { SefariaChunk } from "../src/lib/rag/db"

async function* createMockFullStream(chunks: string[]) {
  for (const chunk of chunks) {
    yield { type: "text-delta", textDelta: chunk }
  }
}

async function streamToEvents(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  const events: Array<{
    type: string
    delta?: string
    items?: Array<{ ref: string; [key: string]: unknown }>
    message?: string
  }> = []
  
  let buffer = ""
  let done = false

  while (!done) {
    const { value, done: readerDone } = await reader.read()
    done = readerDone

    if (value) {
      buffer += decoder.decode(value, { stream: true })
      
      const lines = buffer.split("\n")
      buffer = lines.pop() || ""

      for (const line of lines) {
        if (!line.trim()) continue
        events.push(JSON.parse(line))
      }
    }
  }

  return events
}

describe("Citation Stream Assembly", () => {
  const mockChunks: SefariaChunk[] = [
    {
      id: 1,
      ref: "Genesis 1:1",
      he_ref: "בראשית א:א",
      book: "Genesis",
      category: "Tanakh",
      language: "en",
      version_title: "JPS 1985",
      license: "CC-BY",
      sefaria_url: "https://www.sefaria.org/Genesis.1.1",
      text_content: "In the beginning God created the heaven and the earth",
    },
    {
      id: 2,
      ref: "Talmud Berakhot 2a",
      he_ref: "תלמוד ברכות ב׳ א",
      book: "Berakhot",
      category: "Talmud",
      language: "en",
      version_title: "William Davidson Edition",
      license: "CC-BY-NC",
      sefaria_url: "https://www.sefaria.org/Berakhot.2a",
      text_content: "From what time may one recite the Shema in the evening?",
    },
    {
      id: 3,
      ref: "Exodus 20:1",
      he_ref: "שמות כ:א",
      book: "Exodus",
      category: "Tanakh",
      language: "en",
      version_title: "JPS 1985",
      license: "CC-BY",
      sefaria_url: "https://www.sefaria.org/Exodus.20.1",
      text_content: "And God spoke all these words",
    },
  ]

  it("should stream text deltas and then verified citations", async () => {
    const textChunks = [
      "According to ",
      "Genesis 1:1",
      ", God created ",
      "the world. ",
      "Berakhot 2a ",
      "discusses the Shema.",
    ]
    
    const fullText = textChunks.join("")
    const fullStream = createMockFullStream(textChunks)

    const stream = await createChatStream(
      fullStream,
      Promise.resolve(fullText),
      mockChunks
    )

    const events = await streamToEvents(stream)

    const textEvents = events.filter((e) => e.type === "text")
    expect(textEvents).toHaveLength(textChunks.length)
    expect(textEvents.map((e) => e.delta).join("")).toBe(fullText)

    const citationEvents = events.filter((e) => e.type === "citations")
    expect(citationEvents).toHaveLength(1)

    const citations = citationEvents[0].items || []
    expect(citations.length).toBeGreaterThanOrEqual(1)
    expect(citations.map((c) => c.ref)).toContain("Genesis 1:1")

    const doneEvents = events.filter((e) => e.type === "done")
    expect(doneEvents).toHaveLength(1)
  })

  it("should filter out hallucinated citations not in retrieved chunks", async () => {
    const textChunks = [
      "Genesis 1:1 says God created. ",
      "Leviticus 19:18 says love your neighbor. ",
      "Exodus 20:1 contains the Ten Commandments.",
    ]
    
    const fullText = textChunks.join("")
    const fullStream = createMockFullStream(textChunks)

    const stream = await createChatStream(
      fullStream,
      Promise.resolve(fullText),
      mockChunks
    )

    const events = await streamToEvents(stream)

    const citationEvents = events.filter((e) => e.type === "citations")
    const citations = citationEvents[0].items || []
    expect(citations).toHaveLength(2)
    expect(citations.map((c) => c.ref)).toContain("Genesis 1:1")
    expect(citations.map((c) => c.ref)).toContain("Exodus 20:1")
    expect(citations.map((c) => c.ref)).not.toContain("Leviticus 19:18")
  })

  it("should emit no citation event when model cites nothing", async () => {
    const textChunks = ["This is a response with ", "no citations at all."]
    
    const fullText = textChunks.join("")
    const fullStream = createMockFullStream(textChunks)

    const stream = await createChatStream(
      fullStream,
      Promise.resolve(fullText),
      mockChunks
    )

    const events = await streamToEvents(stream)

    const citationEvents = events.filter((e) => e.type === "citations")
    expect(citationEvents).toHaveLength(0)

    const doneEvents = events.filter((e) => e.type === "done")
    expect(doneEvents).toHaveLength(1)
  })

  it("should include citation metadata with excerpts and links", async () => {
    const textChunks = ["Genesis 1:1 describes creation."]
    
    const fullText = textChunks.join("")
    const fullStream = createMockFullStream(textChunks)

    const stream = await createChatStream(
      fullStream,
      Promise.resolve(fullText),
      mockChunks
    )

    const events = await streamToEvents(stream)

    const citationEvents = events.filter((e) => e.type === "citations")
    const citation = citationEvents[0]?.items?.[0]

    expect(citation).toMatchObject({
      ref: "Genesis 1:1",
      heRef: "בראשית א:א",
      url: "https://www.sefaria.org/Genesis.1.1",
      versionTitle: "JPS 1985",
      license: "CC-BY",
    })
    
    expect(citation?.excerpt).toBeTruthy()
    const excerpt = citation?.excerpt as string | undefined
    expect(excerpt?.length).toBeLessThanOrEqual(200)
  })

  it("should emit error event on mid-stream error part", async () => {
    async function* errorStream() {
      yield { type: "text-delta", textDelta: "Some text " }
      yield { type: "error", error: new Error("Model failed") }
    }

    const stream = await createChatStream(
      errorStream(),
      Promise.resolve("Should not be used"),
      mockChunks
    )

    const events = await streamToEvents(stream)

    const textEvents = events.filter((e) => e.type === "text")
    expect(textEvents).toHaveLength(1)

    const errorEvents = events.filter((e) => e.type === "error")
    expect(errorEvents).toHaveLength(1)
    expect(errorEvents[0].message).toBe("Erro ao processar sua pergunta. Tente novamente.")

    const doneEvents = events.filter((e) => e.type === "done")
    expect(doneEvents).toHaveLength(0)
  })
})
