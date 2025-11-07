export interface IEmbeddingProvider {
  embedding(contents: EmbedContent[]): Promise<EmbedResult[]>
}

export interface EmbedResult {
  message: string
  key: string
  values: number[]
  metadata?: Record<string, string>
}

export interface EmbedContent{
    key:string
    message:string
    metadata?: Record<string, string>
}
