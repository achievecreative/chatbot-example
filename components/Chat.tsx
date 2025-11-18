"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import clsx from "clsx"
import { useRef } from "react"

export default function Chat() {
  const messageInputRef = useRef<HTMLTextAreaElement>(null)
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  })

  const submit = () => {
    const message = messageInputRef.current?.value
    if (!message) {
      return
    }

    sendMessage({ text: message })
    messageInputRef.current!.value = ""
  }

  return (
    <>
      {messages.map((msg) => (
        <div key={msg.id} className="message-item p-3">
          {msg.parts.map((part, index) => {
            if (part.type === "text") {
              return <div key={index}>{part.text}</div>
            }

            return null
          })}
        </div>
      ))}
      <div className="p-4 w-full">
        <textarea
          id="message-input"
          className="placeholder:text-primary-60 text-p2 w-full resize-none bg-transparent focus:outline-none border border-gray-300 rounded-md p-3 shadow-xl"
          rows={6}
          ref={messageInputRef}
        />
      </div>
      <div className="w-full flex justify-end p-4">
        <button
          onClick={submit}
          disabled={status !== "ready"}
          className={clsx(
            "rounded-4xl bg-sky-600 px-5 py-4 w-48 text-white font-medium hover:bg-sky-700",
            "disabled:bg-gray-400 disabled:cursor-not-allowed"
          )}
        >
          Send
        </button>
      </div>
    </>
  )
}
