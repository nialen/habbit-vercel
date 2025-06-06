"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NavIconImg } from "@/components/nav-icon"
import { useAuth } from "@/contexts/auth"
import { LogOut } from "lucide-react"
import { analytics } from "@/lib/analytics"

const navItems = [
  { href: "/", label: "首页", icon: "rocket" },
  { href: "/habits", label: "习惯管理", icon: "badge-bunny" },
  { href: "/advisor", label: "AI顾问", icon: "ai-orb" },
  { href: "/activities", label: "亲子活动", icon: "panda-run" },
  { href: "/statistics", label: "数据统计", icon: "chart-koala" },
  { href: "/rewards", label: "奖励兑换", icon: "gift-astrocat" },
  { href: "/community", label: "家长讨论区", icon: "community-chat" },
  { href: "/notifications", label: "通知中心", icon: "bell-star" },
] as const

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()

  // 如果用户未登录，不显示导航栏
  if (!user) {
    return null
  }

  // 处理导航点击事件追踪
  const handleNavClick = (href: string, label: string) => {
    analytics.track('Navigation Click', { 
      page: href, 
      section: label 
    })
  }

  return (
    <>
      {/* 桌面端侧边栏 */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-blue-100 text-blue-800 flex-col p-4 z-50">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <img src="/logo.svg" alt="StarVoyage Logo" className="h-15 w-auto" />
          </div>
          <p className="text-xs text-blue-700 flex items-center gap-1 ml-4" style={{ marginTop: "-15px" }}>
            <span>家长和孩子一起成长....</span>
            <span className="text-xs">🌱💕✨</span>
          </p>
        </div>

        <nav className="flex-1 min-h-0">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => handleNavClick(item.href, item.label)}
                    className={`flex items-center p-2.5 rounded-lg transition-all duration-200 relative ${
                      isActive
                        ? "bg-blue-200 text-blue-900 shadow-md border-l-4 border-blue-600 transform translate-x-1"
                        : "text-blue-700 hover:bg-blue-200 hover:text-blue-900"
                    }`}
                  >
                    <NavIconImg
                      name={item.icon}
                      className={`mr-2.5 w-5 h-5 ${isActive ? "text-blue-900" : "text-blue-600"}`}
                    />
                    <span className="font-medium text-sm">{item.label}</span>
                    {isActive && <span className="material-icons ml-auto text-blue-600 text-sm">chevron_right</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="mt-4 space-y-3">
          <div className="p-3 bg-white/40 rounded-xl border border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">👶</span>
              </div>
              <div>
                <p className="font-medium text-blue-800 text-sm">小朋友</p>
                <p className="text-xs text-blue-600">6岁 · 已坚持15天</p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => {
              analytics.user.login('logout')
              signOut()
            }}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-blue-700 hover:bg-blue-200 hover:text-blue-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </Button>
        </div>
      </aside>

      {/* 移动端顶部栏 */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md px-4 py-3 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="StarVoyage Logo" className="h-8 w-auto" />
          </div>

          <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span className="material-icons">{isMobileMenuOpen ? "close" : "menu"}</span>
          </Button>
        </div>

        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-md p-4 max-h-96 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      handleNavClick(item.href, item.label)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-100 text-blue-800 border-l-4 border-blue-600"
                        : "text-gray-600 hover:bg-blue-50"
                    }`}
                  >
                    <NavIconImg name={item.icon} className="w-5 h-5" />
                    <span>{item.label}</span>
                    {isActive && <span className="material-icons ml-auto text-blue-600 text-sm">chevron_right</span>}
                  </Link>
                )
              })}

              <button
                onClick={() => {
                  analytics.user.login('logout')
                  signOut()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all text-red-600 hover:bg-red-50 w-full"
              >
                <LogOut className="w-5 h-5" />
                <span>退出登录</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 移动端底部导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md px-2 py-2 z-50">
        <div className="flex justify-around">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavClick(item.href, item.label)}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 ${
                  isActive ? "text-blue-600 bg-blue-50 transform scale-105" : "text-gray-400 hover:text-blue-500"
                }`}
              >
                <NavIconImg name={item.icon} className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && <div className="w-1 h-1 bg-blue-600 rounded-full"></div>}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
