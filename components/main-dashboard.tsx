"use client"

import { useApp } from "@/components/providers"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, TrendingUp, Award, Star, Clock, ChevronRight, Settings } from "lucide-react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import { useEffect } from "react"

interface UserProfile {
  id: string
  email: string
  name: string
  child_name: string
  child_age: number
  avatar_url?: string
  created_at: string
  updated_at: string
}

interface MainDashboardProps {
  user: User | null
  userProfile: UserProfile | null
}

export default function MainDashboard({ user, userProfile }: MainDashboardProps) {
  const { habits, refreshHabits } = useApp()
  const { user: authUser } = useAuth()

  // 当用户登录后，刷新习惯数据
  useEffect(() => {
    if (user?.id) {
      refreshHabits(user.id)
    }
  }, [user?.id, refreshHabits])

  const completedToday = habits.filter((h) => h.completedToday).length
  const totalHabits = habits.length
  const progressPercentage = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0
  const totalStars = habits.reduce((sum, habit) => sum + habit.streak, 0)

  // 获取今日待完成的习惯
  const pendingHabits = habits.filter((h) => !h.completedToday).slice(0, 3)

  // 获取连续天数最高的习惯
  const topHabits = [...habits].sort((a, b) => b.streak - a.streak).slice(0, 3)

  return (
    <div className="min-h-screen bg-blue-50">
      {/* 响应式主内容区 - 根据用户登录状态调整布局 */}
      <main className={`pb-20 md:pb-0 ${authUser ? 'md:ml-64' : ''}`}>
        <div className="p-6 md:p-8 pt-20 md:pt-8">
          {/* 欢迎区域 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">你好，{userProfile?.child_name || "小朋友"}！👋</h1>
                <p className="text-gray-600">今天也要做最棒的自己哦</p>
              </div>
              <Link href="/settings">
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="w-4 h-4" />
                  个人设置
                </Button>
              </Link>
            </div>
          </div>

          {/* 今日概览统计 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="stat-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">今日完成</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{completedToday}</div>
              <div className="text-xs text-gray-500">/ {totalHabits} 个习惯</div>
            </div>

            <div className="stat-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-600" />
                </div>
                <span className="text-sm text-gray-600">累计星星</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{totalStars}</div>
              <div className="text-xs text-gray-500">继续加油</div>
            </div>

            <div className="stat-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-600">完成率</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{Math.round(progressPercentage)}%</div>
              <div className="text-xs text-gray-500">今日进度</div>
            </div>

            <div className="stat-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm text-gray-600">今日积分</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{completedToday * 10}</div>
              <div className="text-xs text-gray-500">+{completedToday * 10} 分</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 待完成任务 */}
            <Card className="card-hover">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-500" />
                    待完成任务
                  </CardTitle>
                  <Link href="/habits">
                    <Button variant="ghost" size="sm">
                      查看全部 <ChevronRight size={16} />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {pendingHabits.length > 0 ? (
                  <div className="space-y-3">
                    {pendingHabits.map((habit) => (
                      <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="habit-icon w-8 h-8 rounded-lg flex items-center justify-center text-sm">
                            {habit.icon}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{habit.name}</p>
                            <p className="text-xs text-gray-500">连续 {habit.streak} 天</p>
                          </div>
                        </div>
                        <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-xs">
                          打卡
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="text-gray-600">今日任务全部完成！</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 坚持之星 */}
            <Card className="card-hover">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    坚持之星
                  </CardTitle>
                  <Link href="/habits">
                    <Button variant="ghost" size="sm">
                      查看全部 <ChevronRight size={16} />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {topHabits.length > 0 ? (
                  <div className="space-y-3">
                    {topHabits.map((habit, index) => (
                      <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-400"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="habit-icon w-8 h-8 rounded-lg flex items-center justify-center text-sm">
                            {habit.icon}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{habit.name}</p>
                            <p className="text-xs text-gray-500">{habit.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">{habit.streak}</p>
                          <p className="text-xs text-gray-500">天</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">⭐</div>
                    <p className="text-gray-600">还没有习惯记录</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 快捷功能区 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/habits">
              <Card className="card-hover cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">习惯管理</h3>
                      <p className="text-sm text-gray-600">记录和管理日常习惯</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/advisor">
              <Card className="card-hover cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">AI 顾问</h3>
                      <p className="text-sm text-gray-600">获取专业育儿建议</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/activities">
              <Card className="card-hover cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">亲子活动</h3>
                      <p className="text-sm text-gray-600">丰富的互动活动</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
} 