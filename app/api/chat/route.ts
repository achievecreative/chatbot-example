import { convertToModelMessages, streamText } from "ai"

import modelProvider from "@/libs/models"

export async function POST(req: Request) {
  const model = modelProvider.getModel()

  const { messages } = await req.json()

  const result = streamText({
    model: model,
    messages: convertToModelMessages(messages),
    system: "You are a helpful assistant that helps people find information.",
  })

  return result.toUIMessageStreamResponse()
}
