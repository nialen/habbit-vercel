import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { AuthProvider } from "@/components/auth-provider"
import { AuthGuard } from "@/components/auth-guard"
import { SimpleNavigation } from "@/components/simple-navigation"
// import { AuthDebug } from "@/components/auth-debug"

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
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <AuthGuard>
              <ConditionalNavigation />
              {children}
            </AuthGuard>
            {/* <AuthDebug /> */}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}

// 条件性导航组件
function ConditionalNavigation() {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname
    // 在认证相关页面不显示导航
    if (pathname.startsWith('/auth') || pathname === '/login') {
      return null
    }
  }
  
  return <SimpleNavigation />
}
