import { IContentProvider } from "./provider"
import { ShopifyProvider } from "./ShopifyProvider"

export type { ContentEntry, IContentProvider } from "./provider"

const contentProvider: IContentProvider = new ShopifyProvider()

export default contentProvider
