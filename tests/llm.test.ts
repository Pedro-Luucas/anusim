import { describe, it, expect, afterEach, vi } from "vitest"
import { getChatModelId, isChatConfigured, getChatModel, DEFAULT_CHAT_MODEL, describeError } from "../src/lib/rag/llm"

describe("llm provider", () => {
  const originalEnv = process.env
  afterEach(() => {
    process.env = originalEnv
    vi.restoreAllMocks()
  })

  it("defaults to Claude Sonnet and ignores gateway-style CHAT_MODEL", () => {
    process.env = { ...originalEnv, CHAT_MODEL: "" }
    expect(getChatModelId()).toBe(DEFAULT_CHAT_MODEL)
    process.env.CHAT_MODEL = "google/gemini-3.5-flash"
    expect(getChatModelId()).toBe(DEFAULT_CHAT_MODEL)
    process.env.CHAT_MODEL = "claude-opus-5"
    expect(getChatModelId()).toBe("claude-opus-5")
  })

  it("is configured only with ANTHROPIC_API_KEY", () => {
    process.env = { ...originalEnv, AI_GATEWAY_API_KEY: "x" }
    delete process.env.ANTHROPIC_API_KEY
    expect(isChatConfigured()).toBe(false)
    process.env.ANTHROPIC_API_KEY = "k"
    expect(isChatConfigured()).toBe(true)
  })

  it("sends anthropic-workspace-id header when configured", async () => {
    process.env = { ...originalEnv, ANTHROPIC_API_KEY: "k", ANTHROPIC_WORKSPACE_ID: "ws_123", CHAT_MODEL: "" }
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ type: "error", error: { type: "x", message: "stop" } }), { status: 400 })
    )
    const model = getChatModel()
    expect(model.modelId).toBe(DEFAULT_CHAT_MODEL)
    try {
      await model.doGenerate({ prompt: [{ role: "user", content: [{ type: "text", text: "oi" }] }] } as never)
    } catch {
      // expected: mocked 400
    }
    const init = fetchSpy.mock.calls[0][1] as RequestInit
    const headers = new Headers(init.headers as HeadersInit)
    expect(headers.get("anthropic-workspace-id")).toBe("ws_123")
  })

  it("describes errors with name, message and statusCode", () => {
    const e = Object.assign(new Error("boom"), { statusCode: 400 })
    expect(describeError(e)).toMatchObject({ name: "Error", message: "boom", statusCode: 400 })
  })
})
