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
import { Target, CheckCircle, TrendingUp, Star, Plus, MoreHorizontal, Check, Trash2, Heart, BookOpen, Sparkles, Users, Dumbbell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HabitsPage() {
  const { habits, loadingHabits, toggleHabit, addHabit, deleteHabit } = useApp()
  const { user } = useAuth()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHabit, setNewHabit] = useState({ name: "", icon: "⭐", category: "健康" })
  const [activeTab, setActiveTab] = useState("my-habits")

  const categories = ["健康", "学习", "卫生", "整理", "社交", "运动"]
  const habitIcons = ["⭐", "🌙", "🦷", "🧸", "📚", "🏃", "🥗", "💧", "🧘", "🎨"]

  // 分类图标和颜色映射
  const categoryConfig = {
    "健康": { icon: Heart, color: "text-red-500", bgColor: "bg-red-50", borderColor: "border-red-200" },
    "学习": { icon: BookOpen, color: "text-green-500", bgColor: "bg-green-50", borderColor: "border-green-200" },
    "卫生": { icon: Sparkles, color: "text-blue-500", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    "整理": { icon: Target, color: "text-yellow-500", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" },
    "社交": { icon: Users, color: "text-purple-500", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
    "运动": { icon: Dumbbell, color: "text-pink-500", bgColor: "bg-pink-50", borderColor: "border-pink-200" }
  }

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

  // 获取分类配置
  const getCategoryConfig = (category: string) => {
    return categoryConfig[category as keyof typeof categoryConfig] || categoryConfig["健康"]
  }

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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            习惯管理
          </h1>
          <p className="text-lg text-gray-600">培养良好习惯，成就美好未来 🌱</p>
        </div>
      </div>

      {/* 统计概览区域 */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 mb-8 border border-blue-100 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          今日进展
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">今日进度</p>
                  <p className="text-3xl font-bold text-gray-800">{completedToday}/{habits.length}</p>
                </div>
              </div>
              <div className="mt-5">
                <Progress value={progressPercentage} className="h-3 bg-blue-100" />
                <p className="text-sm text-blue-600 mt-2 font-medium">{progressPercentage.toFixed(0)}% 完成</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-600 mb-1">累计星星</p>
                  <p className="text-3xl font-bold text-gray-800">{totalStars}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-600 mb-1">习惯总数</p>
                  <p className="text-3xl font-bold text-gray-800">{habits.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 习惯管理标签页 */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-50 p-1 rounded-2xl">
            <TabsTrigger 
              value="my-habits" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
            >
              <CheckCircle className="w-4 h-4" />
              我的习惯 ({habits.length})
            </TabsTrigger>
            <TabsTrigger 
              value="recommended" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
            >
              <Star className="w-4 h-4" />
              推荐习惯 ({defaultHabits.length})
            </TabsTrigger>
          </TabsList>

          {/* 我的习惯标签页 */}
          <TabsContent value="my-habits" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">管理我的习惯</h3>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-6"
              >
                <Plus size={16} className="mr-2" />
                添加习惯
              </Button>
            </div>

            {/* 添加习惯表单 */}
            {showAddForm && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-lg">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  添加新习惯
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">习惯名称</label>
                    <Input
                      value={newHabit.name}
                      onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                      placeholder="例如：早睡早起"
                      className="border-blue-200 focus:border-blue-400 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">图标</label>
                    <select
                      value={newHabit.icon}
                      onChange={(e) => setNewHabit({ ...newHabit, icon: e.target.value })}
                      className="w-full p-3 border border-blue-200 rounded-xl focus:border-blue-400 focus:outline-none bg-white"
                    >
                      {habitIcons.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">分类</label>
                    <select
                      value={newHabit.category}
                      onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                      className="w-full p-3 border border-blue-200 rounded-xl focus:border-blue-400 focus:outline-none bg-white"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button onClick={handleAddHabit} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg rounded-xl">
                    添加习惯
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-gray-300 rounded-xl hover:bg-gray-50">
                    取消
                  </Button>
                </div>
              </div>
            )}

            {/* 我的习惯列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {habits.map((habit) => {
                const categoryConfig = getCategoryConfig(habit.category)
                const CategoryIcon = categoryConfig.icon
                
                return (
                  <div key={habit.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${categoryConfig.bgColor} rounded-2xl flex items-center justify-center text-xl border-2 ${categoryConfig.borderColor} shadow-sm`}>
                          {habit.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{habit.name}</h4>
                          <div className={`flex items-center gap-1 text-xs font-medium ${categoryConfig.color}`}>
                            <CategoryIcon className="w-3 h-3" />
                            <span>{habit.category}</span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32 rounded-xl">
                          <DropdownMenuItem
                            onClick={() => handleDeleteHabit(habit.id)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer rounded-lg"
                          >
                            <Trash2 className="h-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">每天坚持{habit.name}，养成好习惯</p>

                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span className="text-sm text-gray-600 font-medium">连续 {habit.streak} 天</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">{habit.streak}</div>
                        <div className="text-xs text-gray-500 font-medium">天数</div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleToggleHabit(habit.id)}
                      className={`w-full shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl font-semibold ${
                        habit.completedToday
                          ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                          : `bg-gradient-to-r from-white to-gray-50 border-2 ${categoryConfig.borderColor} ${categoryConfig.color} hover:shadow-lg hover:scale-105`
                      }`}
                    >
                      {habit.completedToday ? (
                        <>
                          <CheckCircle size={16} className="mr-2" />
                          已完成
                        </>
                      ) : (
                        <>
                          <CategoryIcon size={16} className="mr-2" />
                          立即打卡
                        </>
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>

            {habits.length === 0 && (
              <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
                <div className="text-8xl mb-6">🌱</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">还没有习惯</h3>
                <p className="text-gray-500 mb-8 text-lg">开始添加第一个好习惯吧！</p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all rounded-xl px-8 py-3"
                >
                  <Plus size={16} className="mr-2" />
                  添加习惯
                </Button>
              </div>
            )}
          </TabsContent>

          {/* 推荐习惯标签页 */}
          <TabsContent value="recommended" className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">发现新习惯</h3>
              <p className="text-gray-600 text-lg">选择适合的习惯，开始你的成长之旅</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {defaultHabits.map((defaultHabit, index) => {
                const isAdded = habits.some(h => h.name === defaultHabit.name)
                const categoryConfig = getCategoryConfig(defaultHabit.category)
                const CategoryIcon = categoryConfig.icon
                
                return (
                  <div key={index} className={`bg-white rounded-2xl p-6 border-2 ${categoryConfig.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105 ${categoryConfig.bgColor} bg-opacity-20`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-14 h-14 ${categoryConfig.bgColor} rounded-2xl flex items-center justify-center text-2xl border-2 ${categoryConfig.borderColor} shadow-lg`}>
                        {defaultHabit.icon}
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{defaultHabit.name}</h4>
                        <div className={`flex items-center gap-1 text-sm font-medium ${categoryConfig.color} mt-1`}>
                          <CategoryIcon className="w-4 h-4" />
                          <span>{defaultHabit.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">{defaultHabit.description}</p>
                    
                    <Button
                      onClick={() => handleAddDefaultHabit(defaultHabit)}
                      disabled={isAdded}
                      className={`w-full text-sm shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl font-semibold ${
                        isAdded
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : `bg-gradient-to-r from-white to-gray-50 border-2 ${categoryConfig.borderColor} ${categoryConfig.color} hover:shadow-lg hover:scale-105`
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          已添加
                        </>
                      ) : (
                        <>
                          <CategoryIcon className="w-4 h-4 mr-1" />
                          添加习惯
                        </>
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  )
}
