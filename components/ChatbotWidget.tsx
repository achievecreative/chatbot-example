"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import React from "react"
import Chat from "./Chat"

export default function ChatbotWidget() {
  const [showChatWidget, setShowChatWidget] = React.useState(false)
  return (
    <div>
      <div
        className={cn(
          "fixed max-h-screen h-[calc(100vh-130px)] right-10 bottom-24 lg:w-[calc(100vw-420px)]  max-w-full p-4 border-0 rounded-lg shadow-lg",
          showChatWidget ? "" : "hidden"
        )}
      >
        <div className="flex min-h-full w-full flex-col bg-white dark:bg-black sm:items-start">
          <Chat />
        </div>
      </div>
      <div className="fixed bottom-6 right-6 rounded-full hover:shadow-lg cursor-pointer">
        <Image
          src="/chatbot-widget.png"
          alt="Chatbot Widget"
          width={65}
          height={65}
          className="m-1"
          onClick={() => setShowChatWidget(!showChatWidget)}
        />
      </div>
    </div>
  )
}
