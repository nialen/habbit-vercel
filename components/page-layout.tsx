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
      {/* 响应式主内容区 - 根据用户登录状态调整布局 */}
      <main className={`pb-20 md:pb-0 ${user ? 'md:ml-64' : ''}`}>
        <div className="p-6 md:p-8 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
} 