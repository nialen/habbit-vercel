"use client"

import { type ReactNode } from "react"
import { useAuth } from "@/components/auth-provider"
import { Rocket } from "lucide-react"
import { WelcomeScreen } from "@/components/auth/welcome-screen"

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading, isDemoMode } = useAuth()

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Rocket className="h-12 w-12 text-blue-500 animate-bounce mx-auto mb-4" />
          <p className="text-lg text-gray-600">星航成长营启动中...</p>
        </div>
      </div>
    )
  }

  // 演示模式或已登录 - 显示应用内容
  if (isDemoMode || isAuthenticated) {
    return <>{children}</>
  }

  // 未登录 - 显示欢迎页面
  return <WelcomeScreen />
} 