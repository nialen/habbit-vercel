"use client"

import { type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Rocket } from "lucide-react"

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // 不需要认证的路由
  const publicRoutes = ['/auth', '/auth/callback', '/auth/auth-code-error']
  const isPublicRoute = publicRoutes.includes(pathname)

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

  // 如果在公共路由，直接显示内容
  if (isPublicRoute) {
    return <>{children}</>
  }

  // 对于需要认证的路由（如 /habits, /advisor 等）
  // 如果未登录，重定向到首页（首页会显示 WelcomeScreen）
  if (!user && pathname !== '/') {
    router.push('/')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Rocket className="h-12 w-12 text-blue-500 animate-bounce mx-auto mb-4" />
          <p className="text-lg text-gray-600">正在跳转...</p>
        </div>
      </div>
    )
  }

  // 显示内容（首页会根据认证状态显示 WelcomeScreen 或主应用）
  return <>{children}</>
} 