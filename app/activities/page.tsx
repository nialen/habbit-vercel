"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Star, BookOpen, Dumbbell, Home, Users, Heart, Filter } from "lucide-react"
import { useApp } from "@/components/providers"

const categoryIcons = {
  学习: BookOpen,
  运动: Dumbbell,
  家务: Home,
  社交: Users,
}

const difficultyColors = {
  1: "bg-green-100 text-green-700",
  2: "bg-yellow-100 text-yellow-700",
  3: "bg-orange-100 text-orange-700",
  4: "bg-red-100 text-red-700",
  5: "bg-purple-100 text-purple-700",
}

export default function ActivitiesPage() {
  const { activities } = useApp()
  const [selectedCategory, setSelectedCategory] = useState<string>("全部")
  const [favorites, setFavorites] = useState<string[]>([])

  const categories = ["全部", "学习", "运动", "家务", "社交"]

  const filteredActivities =
    selectedCategory === "全部" ? activities : activities.filter((activity) => activity.category === selectedCategory)

  const toggleFavorite = (activityId: string) => {
    setFavorites((prev) => (prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId]))
  }

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={12} className={i < difficulty ? "text-yellow-500 fill-current" : "text-gray-300"} />
    ))
  }

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">亲子活动提案</h1>
        <p className="text-gray-600 text-lg">精心设计的亲子时光，让成长更有趣 🎨</p>
      </div>

      {/* 分类筛选 */}
      <Card className="card-hover mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h3 className="font-semibold">活动分类</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category !== "全部" ? categoryIcons[category as keyof typeof categoryIcons] : Calendar
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    selectedCategory === category
                      ? "border-purple-500 bg-purple-500 text-white"
                      : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  {category}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 活动列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => {
          const CategoryIcon = categoryIcons[activity.category as keyof typeof categoryIcons]
          const isFavorite = favorites.includes(activity.id)

          return (
            <Card key={activity.id} className="card-hover overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                      <CategoryIcon className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {activity.category}
                      </Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(activity.id)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Heart size={20} className={isFavorite ? "text-red-500 fill-current" : "text-gray-400"} />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">{activity.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">难度等级</span>
                    <div className="flex items-center gap-1">{getDifficultyStars(activity.difficulty)}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">所需时长</span>
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-sm font-medium">{activity.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <p className="text-sm font-medium text-green-800 mb-1">教育意义</p>
                  <p className="text-sm text-green-700">{activity.educationalValue}</p>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-purple-500 hover:bg-purple-600">开始活动</Button>
                  <Button variant="outline" size="sm">
                    详情
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 推荐活动 */}
      <Card className="card-hover mt-8 bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            活动小贴士
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-orange-800">选择活动时：</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• 考虑孩子的兴趣和能力水平</li>
                <li>• 选择合适的时间和环境</li>
                <li>• 准备必要的材料和工具</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-orange-800">活动过程中：</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• 鼓励孩子主动参与和思考</li>
                <li>• 及时给予正面反馈</li>
                <li>• 享受亲子互动的美好时光</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredActivities.length === 0 && (
        <Card className="card-hover text-center py-12">
          <CardContent>
            <Calendar className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">暂无相关活动</h3>
            <p className="text-gray-500">试试选择其他分类或稍后再来看看吧！</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
