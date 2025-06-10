"use client"

import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { memo, useMemo } from "react"
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
  Settings,
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
  { name: "个人设置", href: "/settings", icon: Settings },
]

export const SimpleNavigation = memo(function SimpleNavigation() {
  const { user, userProfile, signOut, loading } = useAuth()
  const pathname = usePathname()

  // 使用 useMemo 优化用户显示信息的计算
  const userDisplayInfo = useMemo(() => {
    if (!userProfile) return null
    
    return {
      initial: userProfile.child_name?.charAt(0) || "用",
      name: userProfile.child_name || "小朋友",
      age: userProfile.child_age || 6
    }
  }, [userProfile])

  // 如果用户未登录，不显示导航栏
  if (!user) {
    return null
  }

  // 如果还在加载状态，也不显示导航栏
  if (loading) {
    return null
  }

  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 md:bg-gray-50 md:border-r z-10">
      <div className="flex flex-col flex-1">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-20 border-b">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Sparkles className="text-white w-5 h-5" />
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
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-500 font-bold text-sm">
                {userDisplayInfo?.initial}
              </span>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">
                {userDisplayInfo?.name}
              </p>
              <p className="text-xs text-gray-500">
                {userDisplayInfo?.age}岁 · 已坚持15天
              </p>
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
}) 