import { getProducts } from "../shopify/products"
import { ContentEntry, IContentProvider } from "./provider"

export class ShopifyProvider implements IContentProvider {
  async getContents(): Promise<ContentEntry[] | null> {
    const products = await getProducts()
    const contents = products?.map((product) => {
      return {
        key: product.id,
        summary: "",
        content: product.description,
        metadata: {
          title: product.title,
        },
      }
    })

    return contents
  }
}
