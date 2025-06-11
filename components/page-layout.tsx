"use client"

import { useAuth } from "@/components/auth-provider"
import type { ReactNode } from "react"

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* 主内容区 - 不再需要硬编码的侧边栏边距 */}
      <main className="pb-20 md:pb-0">
        <div className="p-6 md:p-8 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
} 