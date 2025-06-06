import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import { Navigation } from "@/components/navigation"
import { Providers } from "@/components/providers"
import { AuthProvider } from "@/contexts/auth"
import { AuthGuard } from "@/components/auth-guard"

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

// Plausible Analytics 配置
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "habitkids.online"
const IS_PRODUCTION = process.env.NODE_ENV === "production"

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
        {/* Plausible Analytics - 仅在生产环境加载 */}
        {IS_PRODUCTION && (
          <>
            <Script
              defer
              data-domain={PLAUSIBLE_DOMAIN}
              src="https://plausible.io/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
              strategy="afterInteractive"
            />
            <Script
              id="plausible-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`
              }}
            />
          </>
        )}
        
        <AuthProvider>
          <Providers>
            <AuthGuard>
              <div className="min-h-screen">
                <Navigation />
                <main className="pb-20 md:pb-0 md:ml-64">{children}</main>
              </div>
            </AuthGuard>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}
