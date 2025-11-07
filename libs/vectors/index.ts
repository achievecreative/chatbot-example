import { PineconeProvider } from "./pineconeProvider"
import { IVectorProvider } from "./provider"

export type { IVectorProvider, VectorContent } from "./provider"

const provider: IVectorProvider = new PineconeProvider()

export default provider
