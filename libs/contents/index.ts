import ContentStackProvider from "./ContentStackProvider"
import { IContentProvider } from "./provider"

export type { ContentEntry, IContentProvider } from "./provider"

const contentProvider: IContentProvider = new ContentStackProvider()

export default contentProvider
