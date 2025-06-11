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
      {/* 主内容区 - 为已登录用户添加左边距以避开固定导航栏 */}
      <main className={`pb-20 md:pb-0 ${user ? 'md:ml-64' : ''}`}>
        <div className="p-6 md:p-8 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
} 