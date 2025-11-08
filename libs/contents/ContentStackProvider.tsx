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
  title: string
  product_copy: {
    product_byline: string
    overview: string
  } & { [key: string]: JOSNRteField }
}

interface JSONRteNode {
  type: "ul" | "li" | "p"
  children: (JSONRteNode | { text: string })[]
}

interface JOSNRteField {
  type: "doc"
  uid: string
  children: JSONRteNode[]
}

export default class ContentStackProvider implements IContentProvider {
  async getContents(): Promise<ContentEntry[] | null> {
    const entries = []
    for (;;) {
      let query = stack
        .ContentType(process.env.CONTENTSTACK_CMS_CONTENTTYPE || "")
        .Query() as Contentstack.Query
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
  const texts: string[] = []
  for (const key in entry.product_copy) {
    texts.push(extractTextFromRteNode(entry.product_copy[key] as JOSNRteField))
  }

  return {
    key: entry.uid,
    summary: entry.product_copy.product_byline || "",
    content: texts.join("\n\n"),
  }
}

function extractTextFromRteNode(jsonRte: JOSNRteField): string {
  const texts: string[] = []

  function traverse(node: JSONRteNode | { text: string }) {
    if ("text" in node) {
      texts.push(node.text)
    } else if ("children" in node) {
      for (const child of node.children) {
        traverse(child)
      }
      if (node.type === "p" || node.type === "ul") {
        texts.push("\n")
      }
    }
  }

  jsonRte.children?.map((node) => traverse(node))

  return texts.join("").trim()
}