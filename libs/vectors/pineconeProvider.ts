import { VectorContent, IVectorProvider } from "./provider"
import embedingProvider from "../embeddings"

import {
  Pinecone,
  PineconeRecord,
  RecordMetadata,
} from "@pinecone-database/pinecone"

export class PineconeProvider implements IVectorProvider {
  private pinecone: Pinecone

  constructor() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || "",
    })
  }
  async search(content: string): Promise<VectorContent[]> {
    const index = this.pinecone.index(
      process.env.PINECONE_INDEX_NAME || "",
      process.env.PINECONE_INDEX_HOST || ""
    )

    const embeddings = await embedingProvider.embedding([
      { key: "search", message: content },
    ])

    const queryVector = embeddings[0].values

    const queryResponse = await index.query({
      topK: 5,
      vector: queryVector,
      includeMetadata: true,
    })

    return queryResponse.matches?.map((match) => {
      return {
        key: match.metadata?.key?.toString() || "",
        message: match.metadata?.message?.toString() || "",
        metadata: Object.fromEntries(
          Object.entries(match.metadata || {})
            .filter(([k]) => k !== "key" && k !== "message")
            .map(([k, v]) => [k, v?.toString() || ""])
        ),
      }
    })
  }

  async reset(): Promise<void> {
    const index = this.pinecone.index(
      process.env.PINECONE_INDEX_NAME || "",
      process.env.PINECONE_INDEX_HOST || ""
    )

    const results = await index.describeIndexStats()
    if ((results.totalRecordCount ?? 0) > 0) {
      await index.deleteAll()
    }
  }

  async upsert(contents: VectorContent[]): Promise<void> {
    const index = this.pinecone.index(
      process.env.PINECONE_INDEX_NAME || "",
      process.env.PINECONE_INDEX_HOST || ""
    )

    const embeddings = await embedingProvider.embedding(contents)

    const records: PineconeRecord<RecordMetadata>[] = embeddings.map(
      (embed) => {
        return {
          id: `${embed.key}-${Math.random().toString(36).substring(2, 15)}`,
          values: embed.values,
          metadata: {
            message: embed.message,
            key: embed.key,
            ...(embed.metadata ?? {}),
          },
        } as PineconeRecord<RecordMetadata>
      }
    )

    for (let i = 0; i < records.length; i += 50) {
      const array = records.slice(i, i + 50)
      await index.upsert(array)
    }
  }
}
