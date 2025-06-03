"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useApp } from "@/components/providers"
import { analytics } from "@/lib/analytics"

export default function HabitsPage() {
  const { habits, setHabits } = useApp()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHabit, setNewHabit] = useState({ name: "", icon: "⭐", category: "健康" })

  const categories = ["健康", "学习", "卫生", "整理", "社交", "运动"]
  const habitIcons = ["⭐", "🌙", "🦷", "🧸", "📚", "🏃", "🥗", "💧", "🧘", "🎨"]

  const toggleHabit = (habitId: string) => {
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

    // 追踪新习惯创建事件
    analytics.habit.created(newHabit.name)

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
    <div className="p-8 pt-20 md:pt-8">
      {/* 页面标题 */}
      <header className="mb-8">
        <h2 className="text-3xl font-semibold text-sky-900">习惯管理</h2>
        <p className="text-sky-700">培养好习惯，成就更好的自己</p>
      </header>

      {/* 统计概览 */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-sky-100 p-6 rounded-xl shadow-lg flex items-center space-x-4">
          <span className="material-icons text-3xl text-sky-500">military_tech</span>
          <div>
            <p className="text-sky-800 text-sm">进行中习惯</p>
            <p className="text-2xl font-bold text-sky-900">{habits.length}</p>
          </div>
        </div>

        <div className="bg-green-100 p-6 rounded-xl shadow-lg flex items-center space-x-4">
          <span className="material-icons text-3xl text-green-500">check_circle</span>
          <div>
            <p className="text-green-800 text-sm">今日完成</p>
            <p className="text-2xl font-bold text-green-900">{completedToday}</p>
          </div>
        </div>

        <div className="bg-purple-100 p-6 rounded-xl shadow-lg flex items-center space-x-4">
          <span className="material-icons text-3xl text-purple-500">trending_up</span>
          <div>
            <p className="text-purple-800 text-sm">累计星星</p>
            <p className="text-2xl font-bold text-purple-900">{totalStars}</p>
          </div>
        </div>

        <div className="bg-pink-100 p-6 rounded-xl shadow-lg flex items-center space-x-4">
          <span className="material-icons text-3xl text-pink-500">star_border</span>
          <div>
            <p className="text-pink-800 text-sm">完成率</p>
            <p className="text-2xl font-bold text-pink-900">{Math.round(progressPercentage)}%</p>
          </div>
        </div>
      </section>

      {/* 今日进度条 */}
      <section className="bg-sky-100 p-6 rounded-xl shadow-lg mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sky-800">今日习惯完成进度</h3>
          <span className="text-sm text-sky-600">
            {completedToday}/{habits.length}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2.5 mb-3" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-sky-700">
            {progressPercentage === 100 ? "🎉 今天的习惯全部完成啦！" : "继续加油，坚持就是胜利！"}
          </span>
          <span className="text-sky-700 font-medium">{Math.round(progressPercentage)}%</span>
        </div>
      </section>

      {/* 我的习惯 */}
      <section className="bg-sky-100 p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-sky-600">⭐ 我的习惯</h3>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors"
          >
            <span className="material-icons mr-2">add</span>
            添加习惯
          </Button>
        </div>

        {/* 添加习惯表单 */}
        {showAddForm && (
          <Card className="mb-6 bg-white shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-sky-800">添加新习惯</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-sky-700">习惯名称</label>
                  <Input
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    placeholder="例如：每天喝8杯水"
                    className="rounded-lg border-sky-200 focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-sky-700">选择图标</label>
                  <div className="flex flex-wrap gap-2">
                    {habitIcons.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewHabit({ ...newHabit, icon })}
                        className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl transition-all ${
                          newHabit.icon === icon ? "border-sky-500 bg-sky-50" : "border-gray-200 hover:border-sky-300"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-sky-700">分类</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setNewHabit({ ...newHabit, category })}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          newHabit.category === category
                            ? "border-sky-500 bg-sky-500 text-white"
                            : "border-gray-200 hover:border-sky-300"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={addHabit} className="bg-blue-500 hover:bg-blue-600 text-white">
                    添加习惯
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                  >
                    取消
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 习惯列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <div key={habit.id} className="bg-white p-5 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-semibold text-sky-900">{habit.name}</h4>
                <button className="text-sky-600 hover:text-sky-800">
                  <span className="material-icons">more_horiz</span>
                </button>
              </div>
              <p className="text-sm text-sky-700 mb-3">每天坚持{habit.name}，养成好习惯</p>

              <span
                className={`inline-block ${
                  habit.category === "健康"
                    ? "bg-sky-200 text-sky-800"
                    : habit.category === "学习"
                      ? "bg-green-200 text-green-800"
                      : habit.category === "卫生"
                        ? "bg-blue-200 text-blue-800"
                        : habit.category === "整理"
                          ? "bg-yellow-200 text-yellow-800"
                          : habit.category === "社交"
                            ? "bg-purple-200 text-purple-800"
                            : "bg-pink-200 text-pink-800"
                } text-xs font-semibold px-2.5 py-0.5 rounded-full mb-4`}
              >
                {habit.category}
              </span>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-sky-600 mb-1">
                  <span>目标: 21天</span>
                  <span>{Math.round((habit.streak / 21) * 100)}%</span>
                </div>
                <div className="w-full bg-sky-200 rounded-full h-2.5">
                  <div
                    className={`${
                      habit.category === "健康"
                        ? "bg-sky-500"
                        : habit.category === "学习"
                          ? "bg-green-500"
                          : habit.category === "卫生"
                            ? "bg-blue-500"
                            : habit.category === "整理"
                              ? "bg-yellow-500"
                              : habit.category === "社交"
                                ? "bg-purple-500"
                                : "bg-pink-500"
                    } h-2.5 rounded-full`}
                    style={{ width: `${Math.min((habit.streak / 21) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-sky-700">
                <div>
                  <p>{habit.streak > 10 ? "习惯养成中" : "新手"}</p>
                  <p>已连击 {habit.streak} 天</p>
                </div>
                <Button
                  onClick={() => toggleHabit(habit.id)}
                  className={`${
                    habit.completedToday ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
                  } text-white px-4 py-2 rounded-lg`}
                >
                  {habit.completedToday ? (
                    <>
                      <span className="material-icons text-sm mr-1">check</span>
                      已完成
                    </>
                  ) : (
                    <>
                      <span className="material-icons text-sm mr-1">add</span>
                      打卡
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {habits.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <span className="material-icons text-5xl text-gray-400 mb-4">military_tech</span>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">还没有添加习惯</h3>
            <p className="text-gray-500 mb-4">点击"添加习惯"开始你的成长之旅吧！</p>
            <Button onClick={() => setShowAddForm(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
              <span className="material-icons text-sm mr-2">add</span>
              添加第一个习惯
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
