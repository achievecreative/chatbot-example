"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Conversation, ConversationContent } from "./ai-elements/conversation"
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
      <Conversation className="w-full">
        <ConversationContent>
          {messages.map((msg) => (
            <div key={msg.id} className="message-item p-3">
              {msg.parts.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <Message key={index} from={msg.role}>
                      <MessageContent>
                        <MessageResponse>{part.text}</MessageResponse>
                      </MessageContent>
                    </Message>
                  )
                }
                return null
              })}
            </div>
          ))}
        </ConversationContent>
      </Conversation>

      <PromptInput onSubmit={handleSubmit} className="mt-4" globalDrop multiple>
        <PromptInputHeader>Good day!</PromptInputHeader>
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
