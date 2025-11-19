import { streamText } from "ai"

import modelProvider from "@/libs/models"
import vectorProvider from "@/libs/vectors"

export async function POST(req: Request) {
  const model = modelProvider.getModel()

  const { messages } = await req.json()

  const lastMessage = messages[messages.length - 1]

  const matchedProducts: { description: string; image: string; id: string }[] =
    []
  if (lastMessage.role === "user") {
    const searchResults = await vectorProvider.search(lastMessage.parts[0].text)
    searchResults.forEach((element) => {
      matchedProducts.push({
        description: element.message,
        image: element.metadata?.image || "",
        id: element.key,
      })
    })
  }

  const result = streamText({
    model: model,
    prompt: `
    You are a helpful assistant that helps people find the right product. 
    Please return top 3 products that match the user's query from the provided product list.

    User query: ${lastMessage.content}
    
    @You have found the following products that might match the user's query:
    ${JSON.stringify(matchedProducts, null, 2)}

    `,
  })

  return result.toUIMessageStreamResponse()
}
