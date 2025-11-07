import { ContentEntry, IContentProvider } from "./provider"
import * as Contentstack from "contentstack"

const stack = Contentstack.Stack({
  api_key: process.env.CONTENTSTACK_CMS_STACK_API_KEY || "",
  delivery_token: process.env.CONTENTSTACK_CMS_DELIVERY_TOKEN || "",
  environment: process.env.CONTENTSTACK_ENVIRONMENT || "",
  branch: process.env.CONTENTSTACK_CMS_BRANCH || "",
  region: (process.env.CONTENTSTACK_CMS_REGION || "us") as Contentstack.Region,
})

interface ContentstackEntry {
  uid: string
  article_content: {
    byline: string
  }
}

export default class ContentStackProvider implements IContentProvider {
  async getContents(): Promise<ContentEntry[] | null> {
    const entries = []
    for (;;) {
      let query = stack.ContentType("health_hub").Query() as Contentstack.Query
      if (entries.length > 0) {
        query = query.skip(entries.length)
      }

      const [results, count] = (await query
        .includeCount()
        .limit(100)
        .toJSON()
        .find()) as [ContentstackEntry[], number]

      entries.push(...mapEntries(results))

      if (entries.length >= count) {
        break
      }
    }

    return entries
  }
}

function mapEntries(entries: ContentstackEntry[]): ContentEntry[] {
  return entries.map(mapEntry)
}

function mapEntry(entry: ContentstackEntry): ContentEntry {
  return {
    key: entry.uid,
    summary: entry.article_content.byline,
    content: "",
  }
}
