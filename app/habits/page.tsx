"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Target, Plus, Star, Award, CheckCircle, MoreHorizontal, Calendar } from 'lucide-react'
import { useApp } from "@/components/providers"
import { Badge } from "@/components/ui/badge"

export default function HabitsPage() {
  const { habits, setHabits } = useApp()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHabit, setNewHabit] = useState({ name: "", icon: "⭐", category: "健康" })

  const categories = ["健康", "学习", "卫生", "整理", "社交", "运动"]
  const habitIcons = ["⭐", "🌙", "🦷", "🧸", "📚", "🏃", "🥗", "💧", "🧘", "🎨"]

  const toggleHabit = (habitId: string) => {
    setHabits(
      habits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              completedToday: !habit.completedToday,
              streak: !habit.completedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1),
            }
          : habit,
      ),
    )
  }

  const addHabit = () => {
    if (!newHabit.name.trim()) return

    const habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      icon: newHabit.icon,
      category: newHabit.category,
      streak: 0,
      completedToday: false,
      createdAt: new Date().toISOString(),
    }

    setHabits([...habits, habit])
    setNewHabit({ name: "", icon: "⭐", category: "健康" })
    setShowAddForm(false)
  }

  const totalStars = habits.reduce((sum, habit) => sum + habit.streak, 0)
  const completedToday = habits.filter((h) => h.completedToday).length
  const progressPercentage = habits.length > 0 ? (completedToday / habits.length) * 100 : 0

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">习惯管理</h1>
        <p className="text-gray-600">培养孩子习惯，见证美好成长</p>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">进行中习惯</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{habits.length}</div>
        </div>

        <div className="stat-card p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">今日完成</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{completedToday}</div>
        </div>

        <div className="stat-card p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-600">累计星星</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{totalStars}</div>
        </div>

        <div className="stat-card p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">完成率</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{Math.round(progressPercentage)}%</div>
        </div>
      </div>

      {/* 今日进度 */}
      <Card className="card-hover mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">今日进度</h3>
            <span className="text-sm text-gray-500">
              {completedToday}/{habits.length}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3 mb-2" />
          <p className="text-sm text-gray-600">
            {progressPercentage === 100 ? "🎉 今天的任务全部完成啦！" : "继续加油，你是最棒的！"}
          </p>
        </CardContent>
      </Card>

      {/* 添加习惯按钮 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">我的习惯</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus size={16} className="mr-2" />
          添加习惯
        </Button>
      </div>

      {/* 添加习惯表单 */}
      {showAddForm && (
        <Card className="card-hover mb-6">
          <CardHeader>
            <CardTitle className="text-lg">添加新习惯</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">习惯名称</label>
                <Input
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  placeholder="例如：每天喝8杯水"
                  className="rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">选择图标</label>
                <div className="flex flex-wrap gap-2">
                  {habitIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewHabit({ ...newHabit, icon })}
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl transition-all ${
                        newHabit.icon === icon
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">分类</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setNewHabit({ ...newHabit, category })}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        newHabit.category === category
                          ? "border-indigo-500 bg-indigo-500 text-white"
                          : "border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={addHabit} className="bg-indigo-600 hover:bg-indigo-700">
                  添加习惯
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  取消
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 习惯列表 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {habits.map((habit) => (
          <Card key={habit.id} className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="habit-icon w-10 h-10 rounded-lg flex items-center justify-center text-lg">
                    {habit.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{habit.name}</h3>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {habit.category}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal size={16} />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">连续天数</span>
                  <span className="font-medium text-gray-800">{habit.streak} 天</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">今日状态</span>
                  {habit.completedToday ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">已完成</Badge>
                  ) : (
                    <Badge variant="outline">未完成</Badge>
                  )}
                </div>

                <Button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-full ${
                    habit.completedToday 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {habit.completedToday ? "已完成" : "立即打卡"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {habits.length === 0 && (
        <Card className="card-hover text-center py-12">
          <CardContent>
            <Target className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">还没有添加习惯</h3>
            <p className="text-gray-500 mb-4">点击"添加习惯"开始你的成长之旅吧！</p>
            <Button onClick={() => setShowAddForm(true)} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus size={16} className="mr-2" />
              添加第一个习惯
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
