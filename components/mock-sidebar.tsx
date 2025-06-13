"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Target, Gift, TrendingUp, Settings } from "lucide-react"

interface MockSidebarProps {
  onNavigate: (page: string) => void
  currentPage: string
}

const sidebarItems = [
  {
    id: 'dashboard',
    label: '首页',
    icon: Home
  },
  {
    id: 'habits',
    label: '习惯管理',
    icon: Target
  },
  {
    id: 'rewards',
    label: '奖励商店',
    icon: Gift
  },
  {
    id: 'progress',
    label: '成长进度',
    icon: TrendingUp
  },
  {
    id: 'settings',
    label: '设置',
    icon: Settings
  }
]

export function MockSidebar({ onNavigate, currentPage }: MockSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">星航成长营</h1>
        <p className="text-sm text-gray-500">模拟演示版</p>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto p-3",
                  isActive && "bg-blue-600 text-white"
                )}
                onClick={() => onNavigate(item.id)}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            )
          })}
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-blue-600 font-medium">演示版本</p>
          <p className="text-xs text-blue-500 mt-1">
            这是一个模拟环境，所有数据都是虚拟的
          </p>
        </div>
      </div>
    </div>
  )
} 