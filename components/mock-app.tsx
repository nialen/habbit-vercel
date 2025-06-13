"use client"

import { useMockAuth } from './auth/mock-auth-provider'
import { MockLogin } from './auth/mock-login'
import { MockSidebar } from './mock-sidebar'
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { useState } from 'react'

// 模拟应用首页内容
function MockAppContent() {
  const { user, signOut } = useMockAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')

  const handleSignOut = async () => {
    await signOut()
  }

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">欢迎回来，{user?.name}！</h2>
              <p className="text-blue-100">
                您的孩子 {user?.child_name} 今天表现很棒！继续保持好习惯吧 🌟
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-2">今日任务</h3>
                <div className="text-3xl font-bold text-blue-600">3/5</div>
                <p className="text-sm text-gray-600 mt-1">完成率 60%</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-2">连续天数</h3>
                <div className="text-3xl font-bold text-green-600">7</div>
                <p className="text-sm text-gray-600 mt-1">保持得很好！</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-2">总积分</h3>
                <div className="text-3xl font-bold text-purple-600">156</div>
                <p className="text-sm text-gray-600 mt-1">可兑换奖励</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4">今日习惯</h3>
              <div className="space-y-3">
                {[
                  { name: '早起', completed: true },
                  { name: '刷牙', completed: true },
                  { name: '读书30分钟', completed: true },
                  { name: '整理玩具', completed: false },
                  { name: '早睡', completed: false }
                ].map((habit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${habit.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={habit.completed ? 'text-gray-900' : 'text-gray-500'}>
                      {habit.name}
                    </span>
                    {habit.completed && <span className="text-green-600 text-sm">✓ 已完成</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'habits':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">习惯管理</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-gray-600">这里是习惯管理页面的内容...</p>
              <p className="text-sm text-gray-500 mt-2">在完整版应用中，您可以添加、编辑和跟踪孩子的各种习惯。</p>
            </div>
          </div>
        )
      
      case 'rewards':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">奖励商店</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-gray-600">这里是奖励商店页面的内容...</p>
              <p className="text-sm text-gray-500 mt-2">在完整版应用中，孩子可以用积分兑换各种奖励。</p>
            </div>
          </div>
        )
      
      case 'progress':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">成长进度</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-gray-600">这里是成长进度页面的内容...</p>
              <p className="text-sm text-gray-500 mt-2">在完整版应用中，您可以查看详细的进度图表和分析。</p>
            </div>
          </div>
        )
      
      default:
        return <div>页面未找到</div>
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <MockSidebar onNavigate={setCurrentPage} currentPage={currentPage} />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">模拟演示</h1>
            <p className="text-sm text-gray-500">星航成长营演示环境</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{user?.name}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              退出
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {renderPageContent()}
        </main>
      </div>
    </div>
  )
}

export function MockApp() {
  const { user, loading, signIn } = useMockAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <MockLogin onLogin={signIn} />
  }

  return <MockAppContent />
} 