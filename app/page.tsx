"use client"

import { useApp } from "@/components/providers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Star, Target, MessageCircle, TrendingUp, Award } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { user, habits } = useApp()

  const completedToday = habits.filter((h) => h.completedToday).length
  const totalHabits = habits.length
  const progressPercentage = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0

  const totalStars = habits.reduce((sum, habit) => sum + habit.streak, 0)

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 space-y-6">
      {/* 欢迎区域 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">你好，{user?.childName || "小朋友"}！</h1>
        <p className="text-gray-600 text-lg">今天也要做最棒的自己哦 ✨</p>
      </div>

      {/* 今日概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="card-hover bg-gradient-to-br from-orange-100 to-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium">今日完成</p>
                <p className="text-3xl font-bold text-orange-700">
                  {completedToday}/{totalHabits}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                <Target className="text-orange-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium">累计星星</p>
                <p className="text-3xl font-bold text-blue-700">{totalStars}</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <Star className="text-blue-600 star-animation" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-pink-100 to-pink-50 border-pink-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-600 font-medium">本周进度</p>
                <p className="text-3xl font-bold text-pink-700">{Math.round(progressPercentage)}%</p>
              </div>
              <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                <TrendingUp className="text-pink-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 今日任务 */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            今日任务
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{habit.icon}</span>
                  <div>
                    <p className="font-semibold">{habit.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {habit.category}
                      </Badge>
                      <span className="text-sm text-gray-500">连续 {habit.streak} 天</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {habit.completedToday ? (
                    <Badge className="bg-green-500 hover:bg-green-600">✅ 已完成</Badge>
                  ) : (
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      打卡
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">今日进度</span>
              <span className="text-sm text-gray-500">
                {completedToday}/{totalHabits}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* 快捷入口 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="card-hover bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-200 rounded-2xl flex items-center justify-center">
                <MessageCircle className="text-purple-600" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-purple-800">AI 烦恼顾问</h3>
                <p className="text-purple-600 text-sm mb-3">有育儿困惑？让AI来帮助你</p>
                <Link href="/advisor">
                  <Button className="bg-purple-500 hover:bg-purple-600">立即咨询</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-green-100 to-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-200 rounded-2xl flex items-center justify-center">
                <Award className="text-green-600" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-800">成就中心</h3>
                <p className="text-green-600 text-sm mb-3">查看孩子的成长足迹</p>
                <Link href="/habits">
                  <Button className="bg-green-500 hover:bg-green-600">查看成就</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
