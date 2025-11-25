import type { Metadata } from "next";
import { Roboto } from "next/font/google"
import "./globals.css"

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Shopping Chatbot",
  description: "A chatbot that helps you shop smarter.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased text-xl`}>
        {children}
      </body>
    </html>
  )
}
