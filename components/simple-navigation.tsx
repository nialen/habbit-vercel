"use client"

import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogoutConfirmDialog } from "@/components/auth/logout-confirm-dialog"
import { memo, useMemo, useState } from "react"
import { LogOut, Sparkles } from "lucide-react"
import { FaHome, FaStar, FaRocket, FaHeart, FaChartBar, FaGift, FaUsers, FaBell, FaCog } from "react-icons/fa"

// 定义导航项 - 使用更可爱的FontAwesome实心图标
const navigationItems = [
  { name: "首页", href: "/", icon: FaHome, color: "text-blue-500" },
  { name: "习惯管理", href: "/habits", icon: FaStar, color: "text-yellow-500" },
  { name: "AI顾问", href: "/advisor", icon: FaRocket, color: "text-purple-500" },
  { name: "亲子活动", href: "/activities", icon: FaHeart, color: "text-pink-500" },
  { name: "数据统计", href: "/statistics", icon: FaChartBar, color: "text-green-500" },
  { name: "奖励兑换", href: "/rewards", icon: FaGift, color: "text-orange-500" },
  { name: "家长社区", href: "/community", icon: FaUsers, color: "text-indigo-500" },
  { name: "通知中心", href: "/notifications", icon: FaBell, color: "text-red-500" },
  { name: "个人设置", href: "/settings", icon: FaCog, color: "text-gray-500" },
]

export const SimpleNavigation = memo(function SimpleNavigation() {
  const { user, userProfile, signOut, loading } = useAuth()
  const pathname = usePathname()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  // 使用 useMemo 优化用户显示信息的计算
  const userDisplayInfo = useMemo(() => {
    if (!userProfile) return null

    return {
      initial: userProfile.child_name?.charAt(0) || "用",
      name: userProfile.child_name || "小朋友",
      age: userProfile.child_age || 6,
    }
  }, [userProfile])

  const handleLogoutClick = () => {
    console.log("🔍 退出登录按钮被点击")
    setShowLogoutDialog(true)
  }

  const handleLogoutConfirm = () => {
    console.log("🔍 用户确认退出登录")
    signOut()
  }

  // 如果用户未登录，不显示导航栏
  if (!user) {
    return null
  }

  // 如果还在加载状态，也不显示导航栏
  if (loading) {
    return null
  }

  return (
    <>
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 bg-glass backdrop-blur-xl border-r border-white/20 z-10">
        <div className="flex flex-col flex-1">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 h-20 border-b border-white/20">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800">星航成长营</h1>
              <p className="text-xs text-slate-500">和孩子一起成长 ✨</p>
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
                      ? "bg-gradient-to-br from-purple-600 to-blue-500 text-white shadow-md"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : item.color}`} />
                  <span>{item.name}</span>
                  {isActive && <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>}
                </Link>
              )
            })}
          </nav>

          {/* 用户信息和退出 */}
          <div className="px-4 py-4 mt-auto border-t border-white/20">
            <div className="p-3 rounded-lg flex items-center gap-3 mb-2 bg-white/5 backdrop-blur-sm">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-500 font-bold text-sm">{userDisplayInfo?.initial}</span>
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-800">{userDisplayInfo?.name}</p>
                <p className="text-xs text-slate-500">{userDisplayInfo?.age}岁 · 已坚持15天</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogoutClick}
              className="w-full justify-center text-slate-500 hover:text-red-500 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </Button>
          </div>
        </div>
      </aside>

      {/* 退出登录确认对话框 */}
      <LogoutConfirmDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog} onConfirm={handleLogoutConfirm} />
    </>
  )
})
