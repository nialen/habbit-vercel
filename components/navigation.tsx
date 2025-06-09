"use client"

import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home,
  Target,
  Bot,
  Heart,
  BarChart2,
  Award,
  Users,
  Bell,
  LogOut,
  Sparkles,
  AlertTriangle,
} from "lucide-react"

// 定义导航项
const navigationItems = [
  { name: "首页", href: "/", icon: Home },
  { name: "习惯管理", href: "/habits", icon: Target },
  { name: "AI 顾问", href: "/advisor", icon: Bot },
  { name: "亲子活动", href: "/activities", icon: Heart },
  { name: "数据统计", href: "/statistics", icon: BarChart2 },
  { name: "奖励兑换", href: "/rewards", icon: Award },
  { name: "家长社区", href: "/community", icon: Users },
  { name: "通知中心", href: "/notifications", icon: Bell },
]

export function Navigation() {
  const { user, userProfile, signOut, loading, error } = useAuth()
  const pathname = usePathname()

  // 状态 1: 初始加载或正在认证
  // loading 为 true 时，显示骨架屏
  if (loading) {
    return (
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 md:bg-gray-50 md:border-r">
        <div className="flex flex-col flex-1 p-4">
          <div className="h-10 bg-gray-200 rounded-md w-3/4 mb-8 animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded-md w-full animate-pulse"></div>
            ))}
          </div>
          <div className="mt-auto h-16 bg-gray-200 rounded-md w-full animate-pulse"></div>
        </div>
      </aside>
    )
  }

  // 状态 2: 加载完成，但出现错误
  // error 不为 null 时，显示错误状态
  if (error) {
    return (
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 md:bg-gray-50 md:border-r">
        <div className="flex flex-col flex-1 p-4 text-center items-center justify-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
          <h3 className="font-semibold text-red-600 mb-2">加载失败</h3>
          <p className="text-xs text-gray-500 mb-4">无法加载您的用户资料，请检查网络连接后刷新页面。</p>
          <p className="text-[10px] text-gray-400 bg-gray-100 p-2 rounded-md overflow-hidden">
            错误: {error.message}
          </p>
          <Button
            variant="ghost"
            onClick={signOut}
            className="w-full justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 mt-6"
          >
            <LogOut className="w-4 h-4 mr-2" />
            尝试退出
          </Button>
        </div>
      </aside>
    )
  }
  
  // 状态 3: 加载完成，但没有用户资料（不太可能发生，但作为保险）
  // userProfile 为 null 时，显示骨架屏
  if (!userProfile) {
    return (
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 md:bg-gray-50 md:border-r">
        <div className="flex flex-col flex-1 p-4">
          <div className="h-10 bg-gray-200 rounded-md w-3/4 mb-8 animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded-md w-full animate-pulse"></div>
            ))}
          </div>
          <div className="mt-auto h-16 bg-gray-200 rounded-md w-full animate-pulse"></div>
        </div>
      </aside>
    )
  }

  // 状态 4: 成功加载，正常显示导航
  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 md:bg-gray-50 md:border-r">
      <div className="flex flex-col flex-1">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-20 border-b">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Sparkles className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-800">星航成长营</h1>
            <p className="text-xs text-gray-500">和孩子一起成长 ✨</p>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* 用户信息和退出 */}
        <div className="px-4 py-4 mt-auto border-t">
          <div className="p-3 bg-white rounded-lg flex items-center gap-3 mb-2">
            <Avatar className="w-10 h-10">
              <AvatarImage src={userProfile.avatar_url} alt={userProfile.child_name} />
              <AvatarFallback className="bg-indigo-100 text-indigo-500 font-bold">
                {userProfile.child_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm text-gray-800">{userProfile.child_name}</p>
              <p className="text-xs text-gray-500">{userProfile.child_age}岁 · 已坚持15天</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={signOut}
            className="w-full justify-center text-gray-500 hover:text-red-500 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </Button>
        </div>
      </div>
    </aside>
  )
}
