"use client"

import { type ReactNode } from "react"
import { useAuth } from "@/contexts/auth"
import { Rocket } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // 不需要认证的路由
  const publicRoutes = ['/login', '/auth/callback', '/auth/auth-code-error']
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

  // 如果未登录且不在公共路由，重定向到登录页
  if (!user) {
    router.push('/login')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Rocket className="h-12 w-12 text-blue-500 animate-bounce mx-auto mb-4" />
          <p className="text-lg text-gray-600">正在跳转到登录页...</p>
        </div>
      </div>
    )
  }

  // 已登录 - 显示应用内容
  return <>{children}</>
} 