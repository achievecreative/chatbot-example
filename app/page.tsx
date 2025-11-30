import ChatbotWidget from "@/components/ChatbotWidget"

export default async function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col py-4 dark:bg-black sm:items-start">
        <ChatbotWidget />
      </main>
    </div>
  )
}
