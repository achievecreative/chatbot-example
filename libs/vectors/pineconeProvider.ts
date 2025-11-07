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

  async reset(): Promise<void> {
    const index = this.pinecone.index(
      process.env.PINECONE_INDEX_NAME || "",
      process.env.PINECONE_INDEX_HOST || ""
    )

    await index.deleteAll()
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
            metadata: embed.metadata ?? [],
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
