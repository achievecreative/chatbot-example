export interface IContentProvider {
  getContents(): Promise<ContentEntry[] | null>
}

export interface ContentEntry {
  key: string
  summary?: string
  content?: string
  metadata?: Record<string, string>
}
