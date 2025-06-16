"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { WelcomeScreen } from "@/components/auth/welcome-screen"
import { LoadingSpinner } from "@/components/loading-spinner"
import { isDemoMode } from "@/lib/app-mode"

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const demoMode = isDemoMode()

  useEffect(() => {
    // 如果用户已登录或处于演示模式，重定向到首页
    if (!loading && (user || demoMode)) {
      router.replace('/')
    }
  }, [user, loading, demoMode, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // 显示欢迎页面（包含登录表单）
  return (
    <div className="fixed inset-0 z-50">
      <WelcomeScreen />
    </div>
  )
}
