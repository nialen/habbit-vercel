import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Nunito } from 'next/font/google'
import { Navigation } from "@/components/navigation"
import { Providers } from "@/components/providers"

const nunito = Nunito({ 
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "小星星习惯养成 - 儿童成长伙伴",
  description: "帮助孩子养成好习惯，促进亲子互动的温馨平台",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={nunito.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
            <Navigation />
            <main className="pb-20 md:pb-0 md:ml-64">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
