import type React from "react"
import "./globals.css"
import { Inter, DM_Serif_Display } from "next/font/google"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Chat } from "@/components/chat"

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
})

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-serif",
  display: "swap",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSerif.variable}>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen bg-white">
          <Header />
          {children}
          <Footer />
        </div>
        <Chat />
      </body>
    </html>
  )
}

