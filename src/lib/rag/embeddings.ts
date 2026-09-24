import { google } from "@ai-sdk/google"
import { openai } from "@ai-sdk/openai"
import { embed } from "ai"

export type EmbedResult = {
  embedding: number[]
  model: string
}

function getEmbeddingModel() {
  const modelName = process.env.EMBEDDING_MODEL || "gemini-embedding-001"

  if (modelName.startsWith("text-embedding")) {
    return openai.embedding(modelName)
  }

  return google.textEmbeddingModel(modelName)
}

export async function embedText(text: string): Promise<EmbedResult> {
  const model = getEmbeddingModel()

  const { embedding } = await embed({
    model,
    value: text,
  })

  return {
    embedding,
    model: model.modelId,
  }
}

export async function embedBatch(
  texts: string[]
): Promise<Array<EmbedResult>> {
  const results: Array<EmbedResult> = []

  for (const text of texts) {
    const result = await embedText(text)
    results.push(result)
  }

  return results
}
