import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Nunito, Comic_Neue } from "next/font/google"
import { Providers } from "@/components/providers"
import { AuthProvider } from "@/components/auth-provider"

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-nunito",
})

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["700"], // Bold weight
  display: "swap",
  variable: "--font-comic-neue",
})

export const metadata: Metadata = {
  title: "HabitKids - 习惯养成助手",
  description: "帮助孩子养成好习惯，只需要21天",
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${nunito.variable} ${comicNeue.variable} ${nunito.className}`}>
        <AuthProvider>
          <Providers>
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}
