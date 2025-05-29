"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "首页", icon: "home" },
  { href: "/habits", label: "习惯管理", icon: "star" },
  { href: "/advisor", label: "AI顾问", icon: "psychology" },
  { href: "/activities", label: "亲子活动", icon: "event" },
  { href: "/statistics", label: "数据统计", icon: "analytics" },
  { href: "/rewards", label: "奖励兑换", icon: "redeem" },
  { href: "/salon", label: "线下沙龙", icon: "groups" },
  { href: "/notifications", label: "通知中心", icon: "notifications" },
]

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* 桌面端侧边栏 */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-blue-100 text-blue-800 flex-col p-6 z-50">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-blue-600">小星星习惯园</h1>
          <p className="text-sm text-blue-700 flex items-center gap-1">
            <span>和孩子一起成长</span>
            <span className="text-xs">🌱</span>
            <span className="text-xs">💕</span>
            <span className="text-xs">✨</span>
          </p>
        </div>

        <nav className="flex-grow overflow-y-auto">
          <ul>
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <li key={item.href} className="mb-3">
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 relative ${
                      isActive
                        ? "bg-blue-200 text-blue-900 shadow-md border-l-4 border-blue-600 transform translate-x-1"
                        : "text-blue-700 hover:bg-blue-200 hover:text-blue-900"
                    }`}
                  >
                    <span className={`material-icons mr-3 text-lg ${isActive ? "text-blue-900" : "text-blue-600"}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm">{item.label}</span>
                    {isActive && <span className="material-icons ml-auto text-blue-600 text-sm">chevron_right</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="mt-auto">
          <div className="p-4 bg-white/40 rounded-xl border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">👶</span>
              </div>
              <div>
                <p className="font-medium text-blue-800">小明</p>
                <p className="text-xs text-blue-600">6岁 · 已坚持15天</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 移动端顶部栏 */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md px-4 py-3 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">⭐</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-blue-800">小星星习惯园</h1>
              <p className="text-xs text-blue-600 flex items-center gap-1">
                <span>和孩子一起成长</span>
                <span className="text-xs">🌱💕</span>
              </p>
            </div>
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
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-100 text-blue-800 border-l-4 border-blue-600"
                        : "text-gray-600 hover:bg-blue-50"
                    }`}
                  >
                    <span className="material-icons">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive && <span className="material-icons ml-auto text-blue-600 text-sm">chevron_right</span>}
                  </Link>
                )
              })}
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
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 ${
                  isActive ? "text-blue-600 bg-blue-50 transform scale-105" : "text-gray-400 hover:text-blue-500"
                }`}
              >
                <span className="material-icons text-lg">{item.icon}</span>
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
