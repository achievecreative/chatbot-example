"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "./ai-elements/conversation"
import { Message, MessageContent, MessageResponse } from "./ai-elements/message"
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "./ai-elements/prompt-input"

import ProductCard from "./ProductCard"

export default function Chat() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  })

  const handleSubmit = (message: PromptInputMessage) => {
    const messageContent = message?.text?.trim() || ""
    if (!messageContent) {
      return
    }

    sendMessage({ text: messageContent })
    message.text = ""
  }

  return (
    <>
      <Conversation className="w-full h-full max-h-[calc(100vh-350px)] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
        <ConversationContent className="overflow-y-auto h-full">
          {messages.map((msg) => (
            <div key={msg.id} className="message-item p-3 flex gap-2">
              {msg.parts.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <Message key={index} from={msg.role}>
                      <MessageContent>
                        <MessageResponse>{part.text}</MessageResponse>
                      </MessageContent>
                    </Message>
                  )
                } else if (part.type == "tool-getProductDetails") {
                  const productInto = part.output as {
                    id: string
                    title: string
                    images: { data: { url: string }[] }
                    variants: {
                      data: {
                        id: string
                        title: string
                        price: {
                          amount: string
                          currencyCode: string
                        }
                        sku: string
                        availableForSale: boolean
                        quantityAvailable: number
                      }[]
                    }
                  }
                  if (!productInto) {
                    return null
                  }
                  const productCard = {
                    id: productInto.id,
                    title: productInto.title,
                    images: productInto.images.data.map((img) => ({
                      url: img.url,
                      altText: "",
                    })),
                    variants: productInto.variants.data,
                  }
                  return <ProductCard {...productCard} key={index} />
                } else if (part.type == "tool-searchProducts") {
                  const searchResult = part.output as {
                    steps: { content: { text: string }[] }[]
                  }
                  if (
                    !searchResult?.steps?.length ||
                    !searchResult.steps[0].content?.length
                  ) {
                    return
                  }

                  return (
                    <Message key={index} from={msg.role}>
                      <MessageContent>
                        <MessageResponse>
                          {searchResult.steps[0].content[0].text}
                        </MessageResponse>
                      </MessageContent>
                    </Message>
                  )
                }
                return null
              })}
            </div>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput
        onSubmit={handleSubmit}
        className="mt-4 px-4"
        globalDrop
        multiple
      >
        <PromptInputHeader>
          Good day! Let me help you find the right snowboard.
        </PromptInputHeader>
        <PromptInputBody>
          <PromptInputTextarea placeholder="What kind of Snowboard you are looking for?" />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools />
          <PromptInputSubmit disabled={status !== "ready"} />
        </PromptInputFooter>
      </PromptInput>
    </>
  )
}
