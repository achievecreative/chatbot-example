import { encoding_for_model } from "tiktoken"
import { EmbedContent, EmbedResult, IEmbeddingProvider } from "./provider"

import { AzureOpenAI } from "openai"

export class AzureEmbeddingProvider implements IEmbeddingProvider {
  async embedding(contents: EmbedContent[]): Promise<EmbedResult[]> {
    const client = new AzureOpenAI({
      apiKey: process.env.AZURE_EMBEDDING_API_KEY,
      endpoint: process.env.AZURE_EMBEDDING_ENDPOINT,
      apiVersion: process.env.AZURE_EMBEDDING_API_VERSION,
    })

    const chunkTexts = contents.map((content) => {
      return {
        chunks: this.chunkText(content.message),
        key: content.key,
        metadata: content.metadata,
      }
    })

    const flatTexts = chunkTexts.flatMap((text) => text.chunks)

    const results = await client.embeddings.create({
      input: flatTexts,
      model: "text-embedding-3-large",
      dimensions: 1024,
    })

    return results.data.map((embed) => {
      const chunkText = flatTexts[embed.index]

      const chunkContent = chunkTexts.find((chunks) =>
        chunks.chunks.includes(chunkText)
      )

      return {
        key: chunkContent?.key,
        message: chunkText,
        values: embed.embedding,
        metadata: chunkContent?.metadata,
      } as EmbedResult
    })
  }

  chunkText(text: string, maxTokens = 200, overlapTokens = 50): string[] {
    const enc = encoding_for_model("text-embedding-3-large")
    const tokens = enc.encode(text)
    const chunks: string[] = []

    let start = 0
    while (start < tokens.length) {
      const end = Math.min(start + maxTokens, tokens.length)
      const chunk = enc.decode(tokens.slice(start, end))
      const decoder = new TextDecoder("utf-8")
      chunks.push(decoder.decode(chunk))
      start += maxTokens - overlapTokens // move window forward
    }

    return chunks
  }
}
