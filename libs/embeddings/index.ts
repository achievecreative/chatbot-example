import { AzureEmbeddingProvider } from "./AzureEmbeddingProvider"
import { IEmbeddingProvider } from "./provider"

export type { IEmbeddingProvider, EmbedResult, EmbedContent } from "./provider"

const provider: IEmbeddingProvider = new AzureEmbeddingProvider()

export default provider
