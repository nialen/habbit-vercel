"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useApp } from "@/components/providers"
import { useAuth } from "@/components/auth-provider"
import { analytics } from "@/lib/analytics"
import { PageLayout } from "@/components/page-layout"
import { Target, CheckCircle, TrendingUp, Star, Plus, MoreHorizontal, Check, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function HabitsPage() {
  const { habits, loadingHabits, toggleHabit, addHabit, deleteHabit } = useApp()
  const { user } = useAuth()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHabit, setNewHabit] = useState({ name: "", icon: "⭐", category: "健康" })

  const categories = ["健康", "学习", "卫生", "整理", "社交", "运动"]
  const habitIcons = ["⭐", "🌙", "🦷", "🧸", "📚", "🏃", "🥗", "💧", "🧘", "🎨"]

  // 常见默认习惯列表
  const defaultHabits = [
    { name: "早睡早起", icon: "🌙", category: "健康", description: "晚上9点睡觉，早上7点起床" },
    { name: "刷牙洗脸", icon: "🦷", category: "卫生", description: "每天早晚认真刷牙洗脸" },
    { name: "整理玩具", icon: "🧸", category: "整理", description: "玩完玩具后主动收拾整理" },
    { name: "阅读绘本", icon: "📚", category: "学习", description: "每天阅读15-30分钟绘本" },
    { name: "多喝水", icon: "💧", category: "健康", description: "每天喝6-8杯水保持健康" },
    { name: "户外运动", icon: "🏃", category: "运动", description: "每天进行30分钟户外活动" },
    { name: "健康饮食", icon: "🥗", category: "健康", description: "多吃蔬菜水果，少吃零食" },
    { name: "感恩日记", icon: "⭐", category: "学习", description: "每天记录3件感恩的事" },
    { name: "帮助家人", icon: "🎨", category: "社交", description: "主动帮助爸爸妈妈做家务" },
    { name: "冥想放松", icon: "🧘", category: "健康", description: "每天5-10分钟的深呼吸" }
  ]

  const handleToggleHabit = async (habitId: string) => {
    if (!user?.id) return
    
    const habit = habits.find(h => h.id === habitId)
    if (habit) {
      // 追踪习惯完成事件
      if (!habit.completedToday) {
        analytics.habit.completed(habit.name)
        // 如果达到了新的连续记录，也追踪连续天数
        if (habit.streak + 1 > 0) {
          analytics.habit.streak(habit.streak + 1)
        }
      }
    }

    await toggleHabit(habitId, user.id)
  }

  const handleAddHabit = async () => {
    if (!newHabit.name.trim() || !user?.id) return

    // 追踪新习惯创建事件
    analytics.habit.created(newHabit.name)

    await addHabit(newHabit, user.id)
    setNewHabit({ name: "", icon: "⭐", category: "健康" })
    setShowAddForm(false)
  }

  const handleAddDefaultHabit = async (defaultHabit: typeof defaultHabits[0]) => {
    if (!user?.id) return
    
    // 检查是否已经存在相同名称的习惯
    if (habits.some(h => h.name === defaultHabit.name)) {
      return
    }

    // 追踪默认习惯创建事件
    analytics.habit.created(defaultHabit.name)

    await addHabit({
      name: defaultHabit.name,
      icon: defaultHabit.icon,
      category: defaultHabit.category,
    }, user.id)
  }

  const handleDeleteHabit = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId)
    if (habit && confirm(`确定要删除习惯"${habit.name}"吗？`)) {
      await deleteHabit(habitId)
      // 追踪习惯删除事件
      analytics.habit.deleted(habit.name)
    }
  }

  const totalStars = habits.reduce((sum, habit) => sum + habit.streak, 0)
  const completedToday = habits.filter((h) => h.completedToday).length
  const progressPercentage = habits.length > 0 ? (completedToday / habits.length) * 100 : 0

  if (loadingHabits) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">加载习惯数据中...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">习惯管理</h1>
        <p className="text-gray-600">培养良好习惯，成就美好未来 🌱</p>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 mb-1">今日进度</p>
                <p className="text-2xl font-bold text-blue-800">{completedToday}/{habits.length}</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progressPercentage} className="bg-blue-200" />
              <p className="text-xs text-blue-600 mt-2">{progressPercentage.toFixed(0)}% 完成</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-yellow-600 mb-1">累计星星</p>
                <p className="text-2xl font-bold text-yellow-800">{totalStars}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 mb-1">习惯总数</p>
                <p className="text-2xl font-bold text-green-800">{habits.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 习惯列表 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">我的习惯</h2>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus size={16} className="mr-2" />
            添加习惯
          </Button>
        </div>

        {/* 添加习惯表单 */}
        {showAddForm && (
          <Card className="mb-6 border-blue-200">
            <CardHeader>
              <CardTitle>添加新习惯</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">习惯名称</label>
                  <Input
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    placeholder="例如：早睡早起"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">图标</label>
                  <select
                    value={newHabit.icon}
                    onChange={(e) => setNewHabit({ ...newHabit, icon: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    {habitIcons.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">分类</label>
                  <select
                    value={newHabit.category}
                    onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddHabit} className="bg-blue-500 hover:bg-blue-600">
                  添加习惯
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <div key={habit.id} className="bg-white p-5 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-semibold text-sky-900">{habit.name}</h4>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-sky-600 hover:text-sky-800 p-1 rounded-md hover:bg-sky-50">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="h-4 mr-2" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-sky-700 mb-3">每天坚持{habit.name}，养成好习惯</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{habit.icon}</span>
                  <span className="text-sm text-gray-600">{habit.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-sky-800">{habit.streak}</div>
                  <div className="text-xs text-sky-600">连续天数</div>
                </div>
              </div>

              <Button
                onClick={() => handleToggleHabit(habit.id)}
                className={`w-full ${
                  habit.completedToday
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-sky-500 hover:bg-sky-600 text-white"
                }`}
              >
                {habit.completedToday ? (
                  <>
                    <CheckCircle size={16} className="mr-2" />
                    已完成
                  </>
                ) : (
                  "立即打卡"
                )}
              </Button>
            </div>
          ))}
        </div>

        {habits.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">还没有习惯</h3>
            <p className="text-gray-500 mb-6">开始添加第一个好习惯吧！</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus size={16} className="mr-2" />
              添加习惯
            </Button>
          </div>
        )}
      </div>

      {/* 推荐习惯 */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">推荐习惯</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {defaultHabits.map((defaultHabit, index) => {
            const isAdded = habits.some(h => h.name === defaultHabit.name)
            
            return (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                    {defaultHabit.icon}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">{defaultHabit.name}</h4>
                    <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                      defaultHabit.category === "健康"
                        ? "bg-sky-100 text-sky-700"
                        : defaultHabit.category === "学习"
                          ? "bg-green-100 text-green-700"
                          : defaultHabit.category === "卫生"
                            ? "bg-blue-100 text-blue-700"
                            : defaultHabit.category === "整理"
                              ? "bg-yellow-100 text-yellow-700"
                              : defaultHabit.category === "社交"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-pink-100 text-pink-700"
                    }`}>
                      {defaultHabit.category}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{defaultHabit.description}</p>
                
                <Button
                  onClick={() => handleAddDefaultHabit(defaultHabit)}
                  disabled={isAdded}
                  className={`w-full text-sm ${
                    isAdded
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-purple-500 hover:bg-purple-600 text-white"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      已添加
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-1" />
                      添加习惯
                    </>
                  )}
                </Button>
              </div>
            )
          })}
        </div>
      </section>
    </PageLayout>
  )
}
