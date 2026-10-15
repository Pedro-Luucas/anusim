import { createAnthropic } from "@ai-sdk/anthropic"

export const DEFAULT_CHAT_MODEL = "claude-sonnet-5-5"

/**
 * Model id for chat. CHAT_MODEL overrides the default, but values that look
 * like AI Gateway ids (e.g. "google/gemini-3.5-flash") are ignored, since the
 * chat now talks to Anthropic directly.
 */
export function getChatModelId(): string {
  const fromEnv = process.env.CHAT_MODEL?.trim()
  if (fromEnv && !fromEnv.includes("/")) return fromEnv
  return DEFAULT_CHAT_MODEL
}

export function isChatConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

export function getChatModel() {
  const workspaceId = process.env.ANTHROPIC_WORKSPACE_ID
  const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    headers: workspaceId ? { "anthropic-workspace-id": workspaceId } : undefined,
  })
  return anthropic(getChatModelId())
}

export function describeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    const e = error as Error & { statusCode?: number; cause?: unknown; url?: string }
    return {
      name: e.name,
      message: e.message,
      statusCode: e.statusCode,
      url: e.url,
      cause: e.cause instanceof Error ? `${e.cause.name}: ${e.cause.message}` : e.cause,
    }
  }
  return { message: String(error) }
}
