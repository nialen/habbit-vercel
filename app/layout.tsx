import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { AuthProvider } from "@/components/auth-provider"
import { AuthGuard } from "@/components/auth-guard"
import { ConditionalNavigation } from "@/components/conditional-navigation"
import { FirstLoginHandler } from "@/components/first-login-handler"


const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "星航成长营 - 习惯养成助手",
  description: "帮助孩子养成好习惯的专业应用",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <AuthGuard>
              <ConditionalNavigation />
              {children}
              <FirstLoginHandler />
            </AuthGuard>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
