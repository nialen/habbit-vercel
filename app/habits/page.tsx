"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Target, Plus, Star, Award, CheckCircle } from "lucide-react"
import { useApp } from "@/components/providers"
import { HabitCard } from "@/components/habit-card"
import { AchievementModal } from "@/components/achievement-modal"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  color: string
  unlockedAt: string
}

export default function HabitsPage() {
  const { habits, setHabits } = useApp()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHabit, setNewHabit] = useState({ name: "", icon: "⭐", category: "健康" })
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)

  const categories = ["健康", "学习", "卫生", "整理", "社交", "运动"]
  const habitIcons = ["⭐", "🌙", "🦷", "🧸", "📚", "🏃", "🥗", "💧", "🧘", "🎨"]

  const checkForAchievements = (updatedHabit: any) => {
    if (updatedHabit.streak === 7) {
      setNewAchievement({
        id: "week_master",
        title: "一周达人",
        description: `恭喜！${updatedHabit.name}已经坚持一周了！`,
        icon: "🏆",
        color: "bg-gradient-to-br from-green-400 to-blue-400",
        unlockedAt: new Date().toISOString(),
      })
    } else if (updatedHabit.streak === 21) {
      setNewAchievement({
        id: "habit_star",
        title: "坚持之星",
        description: `太棒了！${updatedHabit.name}已经坚持21天，养成好习惯！`,
        icon: "⭐",
        color: "bg-gradient-to-br from-blue-400 to-purple-400",
        unlockedAt: new Date().toISOString(),
      })
    }
  }

  const toggleHabit = (habitId: string) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const updatedHabit = {
            ...habit,
            completedToday: !habit.completedToday,
            streak: !habit.completedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1),
          }

          if (!habit.completedToday) {
            checkForAchievements(updatedHabit)
          }

          return updatedHabit
        }
        return habit
      }),
    )
  }

  const addEncouragement = (habitId: string, message: string) => {
    // 这里可以添加鼓励消息的逻辑
    console.log(`为习惯 ${habitId} 添加鼓励: ${message}`)
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
    <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">习惯管理</h1>
        <p className="text-gray-600 text-lg">每一个好习惯都是成长的小星星 ⭐</p>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="card-hover bg-gradient-to-br from-blue-100 to-blue-50">
          <CardContent className="p-6 text-center">
            <Star className="mx-auto mb-2 text-blue-500" size={32} />
            <p className="text-2xl font-bold text-blue-700">{totalStars}</p>
            <p className="text-blue-600 text-sm">累计星星</p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-green-100 to-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="mx-auto mb-2 text-green-500" size={32} />
            <p className="text-2xl font-bold text-green-700">{completedToday}</p>
            <p className="text-green-600 text-sm">今日完成</p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-purple-100 to-purple-50">
          <CardContent className="p-6 text-center">
            <Target className="mx-auto mb-2 text-purple-500" size={32} />
            <p className="text-2xl font-bold text-purple-700">{habits.length}</p>
            <p className="text-purple-600 text-sm">总习惯数</p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-orange-100 to-orange-50">
          <CardContent className="p-6 text-center">
            <Award className="mx-auto mb-2 text-orange-500" size={32} />
            <p className="text-2xl font-bold text-orange-700">{Math.round(progressPercentage)}%</p>
            <p className="text-orange-600 text-sm">今日进度</p>
          </CardContent>
        </Card>
      </div>

      {/* 今日进度条 */}
      <Card className="card-hover mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">今日进度</h3>
            <span className="text-sm text-gray-500">
              {completedToday}/{habits.length}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-4" />
          <p className="text-center mt-2 text-sm text-gray-600">
            {progressPercentage === 100 ? "🎉 今天的任务全部完成啦！" : "继续加油，你是最棒的！"}
          </p>
        </CardContent>
      </Card>

      {/* 添加习惯按钮 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">我的习惯</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-purple-500 hover:bg-purple-600">
          <Plus size={16} className="mr-2" />
          添加习惯
        </Button>
      </div>

      {/* 添加习惯表单 */}
      {showAddForm && (
        <Card className="card-hover mb-6 border-purple-200">
          <CardHeader>
            <CardTitle>添加新习惯</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">习惯名称</label>
                <Input
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  placeholder="例如：每天喝8杯水"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">选择图标</label>
                <div className="flex flex-wrap gap-2">
                  {habitIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewHabit({ ...newHabit, icon })}
                      className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl transition-all ${
                        newHabit.icon === icon
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">分类</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setNewHabit({ ...newHabit, category })}
                      className={`px-4 py-2 rounded-xl border transition-all ${
                        newHabit.category === category
                          ? "border-purple-500 bg-purple-500 text-white"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={addHabit} className="bg-purple-500 hover:bg-purple-600">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} onToggle={toggleHabit} onAddEncouragement={addEncouragement} />
        ))}
      </div>

      {habits.length === 0 && (
        <Card className="card-hover text-center py-12">
          <CardContent>
            <Target className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">还没有添加习惯</h3>
            <p className="text-gray-500 mb-4">点击"添加习惯"开始你的成长之旅吧！</p>
            <Button onClick={() => setShowAddForm(true)} className="bg-purple-500 hover:bg-purple-600">
              <Plus size={16} className="mr-2" />
              添加第一个习惯
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 成就弹窗 */}
      <AchievementModal achievement={newAchievement} onClose={() => setNewAchievement(null)} />
    </div>
  )
}
