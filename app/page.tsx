"use client"

import { useAuth } from "@/components/auth-provider"
import { WelcomeScreen } from "@/components/auth/welcome-screen"
import { Suspense, lazy, useEffect, useState } from "react"

// 动态导入主应用组件，减少首次加载
const MainDashboard = lazy(() => import("@/components/main-dashboard"))

export default function Dashboard() {
  const { user, userProfile, loading, error, isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 添加认证状态日志
  useEffect(() => {
    if (mounted) {
      console.log('📄 页面认证状态:', {
        isAuthenticated,
        hasUser: !!user,
        hasProfile: !!userProfile,
        loading,
        userEmail: user?.email,
        mounted
      })
    }
  }, [mounted, isAuthenticated, user, userProfile, loading])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // 显示错误状态
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">认证出现问题</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            刷新页面
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">正在加载认证信息...</p>
        </div>
      </div>
    )
  }

  // 如果没有认证，显示欢迎页面让用户选择是否登录
  if (!isAuthenticated) {
    console.log('显示欢迎页面 - 用户未认证')
    return <WelcomeScreen />
  }

  // 已登录用户 - 动态加载主应用
  console.log('显示主应用 - 用户已认证')
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <MainDashboard user={user} userProfile={userProfile} />
    </Suspense>
  )
}
