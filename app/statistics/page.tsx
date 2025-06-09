"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useApp } from "@/components/providers"
import { PageLayout } from "@/components/page-layout"

export default function StatisticsPage() {
  const { habits } = useApp()
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week")

  // 模拟统计数据
  const stats = {
    totalHabits: habits.length,
    completedToday: habits.filter((h) => h.completedToday).length,
    totalStars: habits.reduce((sum, habit) => sum + habit.streak, 0),
    longestStreak: Math.max(...habits.map((h) => h.streak), 0),
    weeklyCompletion: 85,
    monthlyCompletion: 78,
    totalDays: 45,
    achievements: 8,
  }

  // 模拟每日完成数据
  const dailyData = [
    { day: "周一", completed: 3, total: 4 },
    { day: "周二", completed: 4, total: 4 },
    { day: "周三", completed: 2, total: 4 },
    { day: "周四", completed: 4, total: 4 },
    { day: "周五", completed: 3, total: 4 },
    { day: "周六", completed: 4, total: 4 },
    { day: "周日", completed: 3, total: 4 },
  ]

  // 习惯分类统计
  const categoryStats = [
    { category: "健康", count: 2, percentage: 40, color: "bg-green-500" },
    { category: "学习", count: 1, percentage: 20, color: "bg-blue-500" },
    { category: "卫生", count: 1, percentage: 20, color: "bg-purple-500" },
    { category: "整理", count: 1, percentage: 20, color: "bg-orange-500" },
  ]

  // 成长里程碑
  const milestones = [
    { title: "第一次打卡", date: "2024-01-01", icon: "🎯", achieved: true },
    { title: "连续7天", date: "2024-01-07", icon: "🔥", achieved: true },
    { title: "连续21天", date: "2024-01-21", icon: "⭐", achieved: true },
    { title: "连续30天", date: "2024-01-30", icon: "🏆", achieved: false },
    { title: "连续100天", date: "2024-03-10", icon: "👑", achieved: false },
  ]

  return (
    <PageLayout>
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">数据统计</h1>
        <p className="text-gray-600">记录成长足迹，见证每一步进步 📊</p>
      </div>

      {/* 时间范围选择 */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "week", label: "本周" },
          { key: "month", label: "本月" },
          { key: "year", label: "本年" },
        ].map((range) => (
          <Button
            key={range.key}
            variant={timeRange === range.key ? "default" : "outline"}
            onClick={() => setTimeRange(range.key as any)}
            className={
              timeRange === range.key
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
            }
          >
            {range.label}
          </Button>
        ))}
      </div>

      {/* 核心数据概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <span className="material-icons text-3xl text-blue-500 mb-2">star</span>
            <p className="text-2xl font-bold text-blue-800">{stats.totalStars}</p>
            <p className="text-sm text-blue-600">累计星星</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6 text-center">
            <span className="material-icons text-3xl text-green-500 mb-2">local_fire_department</span>
            <p className="text-2xl font-bold text-green-800">{stats.longestStreak}</p>
            <p className="text-sm text-green-600">最长连击</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6 text-center">
            <span className="material-icons text-3xl text-purple-500 mb-2">calendar_today</span>
            <p className="text-2xl font-bold text-purple-800">{stats.totalDays}</p>
            <p className="text-sm text-purple-600">坚持天数</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6 text-center">
            <span className="material-icons text-3xl text-orange-500 mb-2">emoji_events</span>
            <p className="text-2xl font-bold text-orange-800">{stats.achievements}</p>
            <p className="text-sm text-orange-600">获得成就</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 每日完成情况 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="material-icons text-blue-500">bar_chart</span>
              本周完成情况
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyData.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 text-sm text-gray-600">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">
                        {day.completed}/{day.total}
                      </span>
                      <span className="text-sm text-gray-500">{Math.round((day.completed / day.total) * 100)}%</span>
                    </div>
                    <Progress value={(day.completed / day.total) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 习惯分类分析 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="material-icons text-green-500">pie_chart</span>
              习惯分类分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.map((category, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-gray-600">{category.category}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{category.count}个习惯</span>
                      <span className="text-sm text-gray-500">{category.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${category.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 成长里程碑 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="material-icons text-purple-500">timeline</span>
            成长里程碑
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    milestone.achieved ? "bg-green-100" : "bg-gray-200"
                  }`}
                >
                  {milestone.achieved ? milestone.icon : "🔒"}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${milestone.achieved ? "text-gray-800" : "text-gray-500"}`}>
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-gray-500">{milestone.date}</p>
                </div>
                {milestone.achieved && (
                  <Badge className="bg-green-100 text-green-800">已达成</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 习惯详细统计 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="material-icons text-orange-500">assessment</span>
            习惯详细统计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                  {habit.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{habit.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="material-icons text-sm text-yellow-500">star</span>
                      <span className="text-sm text-gray-600">连续{habit.streak}天</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-icons text-sm text-green-500">check_circle</span>
                      <span className="text-sm text-gray-600">完成率85%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{habit.streak * 10}</p>
                  <p className="text-sm text-gray-500">获得积分</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
