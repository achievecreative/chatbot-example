"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import React, { useEffect, useRef } from "react"
import Chat from "./Chat"

import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

export default function ChatbotWidget() {
  const containerRef = useRef<HTMLDivElement>(null)

  const [showChatWidget, setShowChatWidget] = React.useState(false)

  const { contextSafe } = useGSAP(() => {}, { scope: containerRef })

  const openChatPanel = contextSafe(() => {
    gsap.to(".chat-panel", {
      duration: 0.6,
      scale: 1, // expand to full size
      opacity: 1,
      ease: "back.out(1.4)",
    })
  })

  const closeChatPanel = contextSafe(() => {
    gsap.to(".chat-panel", {
      duration: 0.6,
      scale: 0, // shrink to zero size
      opacity: 0,
      ease: "back.in(1.4)",
    })
  })

  const widgetClicked = () => {
    setShowChatWidget(!showChatWidget)
  }

  useEffect(() => {
    if (showChatWidget) {
      openChatPanel()
    } else {
      closeChatPanel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showChatWidget])

  return (
    <div ref={containerRef}>
      <div
        className={cn(
          "chat-panel fixed max-h-screen h-[calc(100vh-130px)] right-10 bottom-24 lg:w-[calc(100vw-420px)]  max-w-full p-4 border border-gray-300 rounded-lg shadow-2xl scale-0 opacity-0 transform"
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
          onClick={widgetClicked}
        />
      </div>
    </div>
  )
}
