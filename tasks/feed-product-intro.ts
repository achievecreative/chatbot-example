import "./setup-env"
import { createAzure } from "@ai-sdk/azure"
import { generateText } from "ai"
import { getProducts, invokeShopifyAdminApi } from "@/libs/shopify"

const updateProduct = `
mutation($product: ProductUpdateInput){
  productUpdate(product: $product){
    product{
      id
    }
  }
}
`

const azure = createAzure({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  resourceName: process.env.AZURE_OPENAI_RESOURCE_NAME!,
})

const client = azure(process.env.AZURE_OPENAI_MODEL!)

async function updateProductDescription(
  id: string,
  description: string
): Promise<void> {
  await invokeShopifyAdminApi<
    object,
    { product: { id: string; descriptionHtml: string } }
  >(updateProduct, {
    product: {
      id: id,
      descriptionHtml: description,
    },
  })
}

async function execute(): Promise<void> {
  const products = await getProducts()

  for (const product of products) {
    const { text } = await generateText({
      model: client,

      prompt: `I need your to write me a product description for a new product in my store. 
            - Output should be in HTML format with at least 3 paragraphs.
            - Output only the HTML, no labels or code fences
            - The description should be engaging and highlight the key features of the product.
            - Use a friendly and persuasive tone.

        The prouct name is :${product.title}
    `,
    })
    await updateProductDescription(product.id, text)
  }
}

execute()
  .then(() => process.exit(0))
  .catch((error) => console.error(error))
