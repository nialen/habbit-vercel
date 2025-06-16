"use client"

import { useAuth } from "@/components/auth-provider"
import type { ReactNode } from "react"

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  const { user } = useAuth()

  return (
    <div className="gradient-background">
      {/* 装饰性浮动元素 */}
      <div className="floating-elements">
        <div className="floating-star" style={{ top: '10%', left: '5%', fontSize: '1.5rem' }}>⭐</div>
        <div className="floating-cloud" style={{ top: '15%', right: '8%', fontSize: '2rem' }}>☁️</div>
        <div className="floating-star" style={{ top: '25%', right: '20%', fontSize: '1.2rem' }}>✨</div>
        <div className="floating-cloud" style={{ bottom: '20%', left: '10%', fontSize: '1.8rem' }}>☁️</div>
        <div className="floating-star" style={{ bottom: '15%', right: '15%', fontSize: '1.3rem' }}>⭐</div>
        <div className="floating-star" style={{ top: '40%', left: '15%', fontSize: '1rem' }}>✨</div>
        <div className="floating-cloud" style={{ top: '60%', right: '5%', fontSize: '1.5rem' }}>☁️</div>
      </div>
      
      {/* 主内容区 - 为已登录用户添加左边距以避开固定导航栏 */}
      <main className={`pb-20 md:pb-0 ${user ? 'md:ml-64' : ''} relative z-10`}>
        <div className="p-6 md:p-8 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
} 