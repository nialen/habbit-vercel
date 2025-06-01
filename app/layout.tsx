import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Navigation } from "@/components/navigation"
import { Providers } from "@/components/providers"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "星航成长营 StarVoyage - 儿童成长伙伴",
  description: "帮助孩子养成好习惯，促进亲子互动的专业平台",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            <div className="min-h-screen">
              <Navigation />
              <main className="pb-20 md:pb-0 md:ml-64">{children}</main>
            </div>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}
