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
      <div className="gradient-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🚀</div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-kidsPrimary-200 border-t-kidsPrimary-500 mx-auto mb-4"></div>
          <p className="font-comic-neue text-xl text-kidsPrimary-600 font-semibold">正在启动成长之旅...</p>
        </div>
      </div>
    )
  }

  // 显示错误状态
  if (error) {
    return (
      <div className="gradient-background flex items-center justify-center">
        <div className="kids-card p-8 text-center max-w-md mx-auto">
          <div className="text-6xl mb-6">😅</div>
          <h2 className="text-2xl font-bold text-kidsPrimary-700 mb-4">哎呀，出了点小问题</h2>
          <p className="text-kidsPrimary-600 mb-6 leading-relaxed">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="kids-button"
          >
            <span className="mr-2">🔄</span>
            重新试试
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="gradient-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🌟</div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-kidsPrimary-200 border-t-kidsPrimary-500 mx-auto mb-4"></div>
          <p className="font-comic-neue text-xl text-kidsPrimary-600 font-semibold">正在验证身份...</p>
          <p className="text-kidsPrimary-500 mt-2">马上就好啦~ ✨</p>
        </div>
      </div>
    )
  }

  // 如果有用户但没有用户资料，显示加载状态（用户资料正在获取中）
  if (user && !userProfile && !loading) {
    return (
      <div className="gradient-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">👤</div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-kidsPrimary-200 border-t-kidsPrimary-500 mx-auto mb-4"></div>
          <p className="font-comic-neue text-xl text-kidsPrimary-600 font-semibold">正在设置您的专属空间...</p>
          <p className="text-kidsPrimary-500 mt-2">即将完成~ ✨</p>
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
      <div className="gradient-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🎉</div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-kidsPrimary-200 border-t-kidsPrimary-500 mx-auto mb-4"></div>
          <p className="font-comic-neue text-xl text-kidsPrimary-600 font-semibold">准备进入成长世界...</p>
        </div>
      </div>
    }>
      <MainDashboard user={user} userProfile={userProfile} />
    </Suspense>
  )
}
