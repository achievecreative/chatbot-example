import { en } from "zod/locales"
import "./setup-env"
import { createAzure } from "@ai-sdk/azure"
import { generateText } from "ai"

const queryProducts = `
query ($first: Int, $after: String) {
  products(first: $first, after: $after) {
    pageInfo {
      hasNextPage
      endCursor
    }
    products: edges {
      product: node {
        id
        title
      }
    }
  }
}
`

const updateProduct = `
mutation($product: ProductUpdateInput){
  productUpdate(product: $product){
    product{
      id
    }
  }
}
`

interface ProductInfo {
  id: string
  title: string
}

interface ProductsResponse {
  data: {
    products: {
      pageInfo: {
        hasNextPage: boolean
        endCursor: string | null
      }
      products: {
        product: ProductInfo
      }[]
    }
  }
}

const azure = createAzure({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: process.env.AZURE_OPENAI_EndPoint,
})

const client = azure(process.env.AZURE_OPENAI_MODEL!)

async function fetchProducts(): Promise<ProductInfo[]> {
  const products: ProductInfo[] = []

  let endCursor: string | null = null

  while (true) {
    const response = (await fetch(
      `https://${process.env.SHOPIFY_DOMAIN}/admin/api/2025-10/graphql.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: queryProducts,
          variables: {
            first: 10,
            after: endCursor,
          },
        }),
      }
    ).then<ProductsResponse>((res) => res.json())) as ProductsResponse

    products.push(
      ...response.data.products.products.map((edge) => edge.product)
    )

    endCursor = response.data.products.pageInfo.endCursor

    if (!endCursor) {
      break
    }
  }

  return products
}

async function updateProductDescription(
  id: string,
  description: string
): Promise<void> {
  await fetch(
    `https://${process.env.SHOPIFY_DOMAIN}/admin/api/2025-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: updateProduct,
        variables: {
          product: {
            id: id,
            descriptionHtml: description,
          },
        },
      }),
    }
  ).then((res) => res.json())
}

async function execute(): Promise<void> {
  const products = await fetchProducts()

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
