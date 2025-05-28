"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Target, MessageCircle, Calendar, MapPin, Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/habits", label: "习惯管理", icon: Target },
  { href: "/advisor", label: "AI顾问", icon: MessageCircle },
  { href: "/activities", label: "亲子活动", icon: Calendar },
  { href: "/salon", label: "线下沙龙", icon: MapPin },
  { href: "/notifications", label: "通知", icon: Bell },
]

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* 桌面端侧边栏 */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-lg border-r border-orange-100 flex-col p-6 z-50">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">⭐</span>
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">小星星</h1>
            <p className="text-sm text-gray-500">习惯养成</p>
          </div>
        </div>

        <div className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="mt-auto p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">👶</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800">小明</p>
              <p className="text-sm text-gray-500">6岁</p>
            </div>
          </div>
        </div>
      </nav>

      {/* 移动端顶部栏 */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-b border-orange-100 px-4 py-3 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">⭐</span>
            </div>
            <h1 className="text-lg font-bold gradient-text">小星星</h1>
          </div>

          <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-orange-100 p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white"
                        : "text-gray-600 hover:bg-orange-50"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* 移动端底部导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-orange-100 px-2 py-2 z-50">
        <div className="flex justify-around">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                  isActive ? "text-orange-500" : "text-gray-400"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
