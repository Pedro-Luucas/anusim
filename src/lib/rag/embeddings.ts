import { embed, embedMany } from "ai"
import { EMBEDDING_DIMENSIONS } from "./config"

export type EmbedResult = {
  embedding: number[]
  model: string
}

function getEmbeddingModelId(): string {
  return process.env.EMBEDDING_MODEL || "google/gemini-embedding-001"
}

function getEmbeddingDimensions(): number {
  const envDims = process.env.EMBEDDING_DIMENSIONS
  return envDims ? parseInt(envDims, 10) : EMBEDDING_DIMENSIONS
}

export async function embedText(text: string): Promise<EmbedResult> {
  const modelId = getEmbeddingModelId()
  const dimensions = getEmbeddingDimensions()

  const { embedding } = await embed({
    model: modelId,
    value: text,
    providerOptions: {
      google: {
        outputDimensionality: dimensions,
      },
    },
  })

  if (embedding.length !== dimensions) {
    throw new Error(
      `Embedding dimension mismatch: expected ${dimensions}, got ${embedding.length}`
    )
  }

  return {
    embedding,
    model: modelId,
  }
}

export async function embedBatch(
  texts: string[]
): Promise<Array<EmbedResult>> {
  if (texts.length === 0) return []

  const modelId = getEmbeddingModelId()
  const dimensions = getEmbeddingDimensions()

  const { embeddings } = await embedMany({
    model: modelId,
    values: texts,
    providerOptions: {
      google: {
        outputDimensionality: dimensions,
      },
    },
  })

  embeddings.forEach((embedding, idx) => {
    if (embedding.length !== dimensions) {
      throw new Error(
        `Embedding dimension mismatch at index ${idx}: expected ${dimensions}, got ${embedding.length}`
      )
    }
  })

  return embeddings.map((embedding) => ({
    embedding,
    model: modelId,
  }))
}
