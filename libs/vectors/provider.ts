export interface VectorContent {
  key: string
  message: string
  metadata?: Record<string, string>
}

export interface IVectorProvider {
    
  upsert(contents: VectorContent[]): Promise<void>

  reset(): Promise<void>
}
