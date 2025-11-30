import { convertToModelMessages, generateText, streamText } from "ai"

import modelProvider from "@/libs/models"
import vectorProvider from "@/libs/vectors"

import { z } from "zod"
import { getProduct } from "@/libs/shopify"

export async function POST(req: Request) {
  const model = modelProvider.getModel()

  const { messages } = await req.json()

  const streamResult = streamText({
    model: model,
    system: `
    You are a helpful assistant that helps people find the right product. 
    You will call tools to search for products, get product details, and add products to the shopping cart based on user requests.

    `,
    messages: convertToModelMessages(messages),
    tools: {
      searchProducts: {
        description: "Search for products in the product database",
        inputSchema: z.object({
          text: z.string().describe("The search text"),
        }),
        execute: async ({ text }) => {
          const matchedProducts: {
            description: string
            image: string
            id: string
          }[] = []

          const searchResults = await vectorProvider.search(text)
          searchResults.forEach((element) => {
            matchedProducts.push({
              description: element.message,
              image: element.metadata?.image || "",
              id: element.key,
            })
          })

          const searchProductResult = generateText({
            model: model,
            prompt: `
            You are a helpful assistant that helps people find the right product.
            Please return top 3 products that match the user's query from the provided product list with the summary of each product.

            User query: ${text}

            @You have found the following products that might match the user's query:
            ${JSON.stringify(matchedProducts, null, 2)}

            `,
          })

          return searchProductResult
        },
      },
      getProductDetails: {
        description: "Pull the product details from Shopify",
        inputSchema: z.object({
          id: z.string().describe("The product ID"),
        }),
        execute: async ({ id }) => {
          const productDetail = await getProduct(id)
          return productDetail
        },
      },
      addToCart: {
        description: "Add the product to the shopping cart",
        inputSchema: z.object({
          id: z.string().describe("The product ID"),
        }),
        execute: async ({ id }) => {
          console.info("🚀🚀 Added to cart", id)
          return true
        },
      },
    },
  })

  return streamResult.toUIMessageStreamResponse()
}
