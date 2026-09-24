import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { POST } from "../src/app/api/chat/route"
import type { SefariaChunk } from "../src/lib/rag/db"

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
]

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

  if (buffer.trim()) {
    try {
      events.push(JSON.parse(buffer))
    } catch {
      // Ignore unparseable final buffer
    }
  }

  return events
}

describe("Chat API Route", () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv, AI_GATEWAY_API_KEY: "test-key" }
  })

  afterEach(() => {
    process.env = originalEnv
    vi.restoreAllMocks()
  })

  it("should return 400 for invalid JSON", async () => {
    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      body: "not json",
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.error).toBe("JSON inválido")
  })

  it("should return 400 for messages over 500 characters", async () => {
    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "a".repeat(501) }],
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.error).toContain("muito longa")
  })

  it("should return 400 for empty messages array", async () => {
    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [] }),
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.error).toBe("Mensagens inválidas")
  })

  it("should return 400 when last message is not from user", async () => {
    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "user", content: "Hello" },
          { role: "assistant", content: "Hi there" },
        ],
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.error).toBe("Última mensagem deve ser do usuário")
  })

  it("should stream text, citations, and done events", async () => {
    const mockSearch = vi.fn().mockResolvedValue({
      chunks: mockChunks,
      source: "database",
    })

    vi.doMock("@/lib/rag/search", () => ({
      searchForQuery: mockSearch,
    }))

    let capturedSystem = ""
    let capturedMessages: Array<{ role: string; content: string }> = []

    const mockStreamText = vi.fn().mockImplementation(async ({ system, messages }) => {
      capturedSystem = system
      capturedMessages = messages

      async function* mockFullStream() {
        yield { type: "text-delta", textDelta: "Genesis 1:1 " }
        yield { type: "text-delta", textDelta: "says God created." }
      }

      return {
        fullStream: mockFullStream(),
        text: Promise.resolve("Genesis 1:1 says God created."),
      }
    })

    vi.doMock("ai", () => ({
      streamText: mockStreamText,
    }))

    const { POST: mockedPOST } = await import("../src/app/api/chat/route")

    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "What is Genesis 1:1?" }],
      }),
    })

    const response = await mockedPOST(request)

    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toBe("application/x-ndjson")

    expect(capturedSystem).toContain("assistente de estudos judaicos")
    expect(capturedSystem).toContain("Genesis 1:1")

    expect(capturedMessages).toHaveLength(1)
    expect(capturedMessages[0].role).toBe("user")
    expect(capturedMessages[0].content).toBe("What is Genesis 1:1?")

    const events = await streamToEvents(response.body!)

    const textEvents = events.filter((e) => e.type === "text")
    expect(textEvents.length).toBeGreaterThan(0)

    const citationEvents = events.filter((e) => e.type === "citations")
    expect(citationEvents).toHaveLength(1)
    expect(citationEvents[0].items).toHaveLength(1)
    expect(citationEvents[0].items![0].ref).toBe("Genesis 1:1")

    const doneEvents = events.filter((e) => e.type === "done")
    expect(doneEvents).toHaveLength(1)
  })

  it("should emit PT-BR error event on model failure", async () => {
    const mockSearch = vi.fn().mockResolvedValue({
      chunks: mockChunks,
      source: "database",
    })

    vi.doMock("@/lib/rag/search", () => ({
      searchForQuery: mockSearch,
    }))

    const mockStreamText = vi.fn().mockRejectedValue(new Error("Model failed"))

    vi.doMock("ai", () => ({
      streamText: mockStreamText,
    }))

    const { POST: mockedPOST } = await import("../src/app/api/chat/route")

    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Test" }],
      }),
    })

    const response = await mockedPOST(request)

    expect(response.status).toBe(500)
    const body = await response.json()
    expect(body.error).toBe("Erro ao processar sua pergunta. Tente novamente.")
  })
})
