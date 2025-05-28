"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Target, MessageCircle, Calendar, MapPin, Bell, Menu, X, BarChart3, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/habits", label: "习惯管理", icon: Target },
  { href: "/advisor", label: "AI顾问", icon: MessageCircle },
  { href: "/activities", label: "亲子活动", icon: Calendar },
  { href: "/salon", label: "线下沙龙", icon: MapPin },
  { href: "/notifications", label: "通知中心", icon: Bell },
]

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* 桌面端侧边栏 */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 sidebar-gradient border-r border-white/20 flex-col p-6 z-50">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-bold">⭐</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">小星星习惯园</h1>
            <p className="text-sm text-gray-500">培养孩子好习惯</p>
          </div>
        </div>

        <div className="space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                  isActive
                    ? "active"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="mt-auto p-4 bg-white/40 rounded-xl border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">👶</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">小明</p>
              <p className="text-xs text-gray-500">6岁 · 已坚持15天</p>
            </div>
          </div>
        </div>
      </nav>

      {/* 移动端顶部栏 */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-white/20 px-4 py-3 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">⭐</span>
            </div>
            <h1 className="text-lg font-bold text-gray-800">小星星习惯园</h1>
          </div>

          <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/90 backdrop-blur-lg border-b border-white/20 p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`nav-item flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                      isActive
                        ? "active"
                        : "text-gray-600"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* 移动端底部导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-white/20 px-2 py-2 z-50">
        <div className="flex justify-around">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-400"
                }`}
              >
                <Icon size={18} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
