import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { embed, embedMany } from "ai"
import { EMBEDDING_DIMENSIONS } from "./config"

export type EmbedResult = {
  embedding: number[]
  model: string
}

function getEmbeddingModel() {
  const gatewayKey = process.env.AI_GATEWAY_API_KEY
  const modelId = process.env.EMBEDDING_MODEL || "google/gemini-embedding-004"

  if (!gatewayKey) {
    throw new Error(
      "AI_GATEWAY_API_KEY is required. Set it in your environment variables."
    )
  }

  if (modelId.startsWith("google/")) {
    const google = createGoogleGenerativeAI({
      apiKey: gatewayKey,
      baseURL: "https://gateway.ai.cloudflare.com/v1",
    })
    
    return google.textEmbeddingModel(modelId.replace("google/", ""))
  }

  if (modelId.startsWith("openai/")) {
    const openai = createOpenAI({
      apiKey: gatewayKey,
      baseURL: "https://gateway.ai.cloudflare.com/v1",
    })
    
    return openai.embedding(modelId.replace("openai/", ""))
  }

  throw new Error(
    `Unknown embedding model provider for: ${modelId}. Use google/ or openai/ prefix.`
  )
}

export async function embedText(text: string): Promise<EmbedResult> {
  const model = getEmbeddingModel()

  const { embedding } = await embed({
    model,
    value: text,
  })

  if (embedding.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Embedding dimension mismatch: expected ${EMBEDDING_DIMENSIONS}, got ${embedding.length}`
    )
  }

  return {
    embedding,
    model: model.modelId,
  }
}

export async function embedBatch(
  texts: string[]
): Promise<Array<EmbedResult>> {
  if (texts.length === 0) return []

  const model = getEmbeddingModel()

  const { embeddings } = await embedMany({
    model,
    values: texts,
  })

  embeddings.forEach((embedding, idx) => {
    if (embedding.length !== EMBEDDING_DIMENSIONS) {
      throw new Error(
        `Embedding dimension mismatch at index ${idx}: expected ${EMBEDDING_DIMENSIONS}, got ${embedding.length}`
      )
    }
  })

  return embeddings.map((embedding) => ({
    embedding,
    model: model.modelId,
  }))
}
