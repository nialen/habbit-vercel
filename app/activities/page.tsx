"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useApp } from "@/components/providers"

const categoryIcons = {
  学习: "school",
  运动: "sports",
  家务: "home",
  社交: "groups",
  手工: "palette",
  音乐: "music_note",
  科学: "science",
  烹饪: "restaurant",
  责任: "assignment",
}

const difficultyColors = {
  1: "bg-green-100 text-green-700",
  2: "bg-yellow-100 text-yellow-700",
  3: "bg-orange-100 text-orange-700",
  4: "bg-red-100 text-red-700",
  5: "bg-purple-100 text-purple-700",
}

const ageGroups = [
  { label: "3-4岁", value: "3-4" },
  { label: "5-6岁", value: "5-6" },
  { label: "7-8岁", value: "7-8" },
  { label: "9-10岁", value: "9-10" },
]

export default function ActivitiesPage() {
  const { activities } = useApp()
  const [selectedCategory, setSelectedCategory] = useState<string>("全部")
  const [selectedAge, setSelectedAge] = useState<string>("全部年龄")
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])

  // 扩展的活动数据
  const extendedActivities = [
    {
      id: "1",
      title: "一起做手工",
      category: "手工",
      difficulty: 2,
      duration: "30-45分钟",
      description: "制作创意的纸艺作品，培养动手能力",
      educationalValue: "提高专注力和创造力",
      ageGroup: "3-4",
      materials: ["彩纸", "胶水", "剪刀", "画笔"],
      steps: ["准备材料", "设计图案", "剪切拼贴", "装饰完成"],
    },
    {
      id: "2",
      title: "户外寻宝游戏",
      category: "运动",
      difficulty: 3,
      duration: "60分钟",
      description: "在公园或小区寻找指定物品",
      educationalValue: "锻炼观察力和体能",
      ageGroup: "5-6",
      materials: ["寻宝清单", "小袋子", "奖励贴纸"],
      steps: ["制定清单", "开始寻找", "记录发现", "分享收获"],
    },
    {
      id: "3",
      title: "制作彩虹实验",
      category: "科学",
      difficulty: 3,
      duration: "45分钟",
      description: "用简单的材料制作彩虹，学习光的折射原理",
      educationalValue: "培养科学思维和观察能力",
      ageGroup: "5-6",
      materials: ["透明杯子", "水", "手电筒", "三棱镜"],
      steps: ["准备材料", "调整光线", "观察现象", "记录结果"],
    },
    {
      id: "4",
      title: "亲子烘焙时光",
      category: "烹饪",
      difficulty: 2,
      duration: "90分钟",
      description: "和孩子一起制作简单的饼干或蛋糕",
      educationalValue: "培养动手能力和数学概念",
      ageGroup: "3-4",
      materials: ["面粉", "鸡蛋", "糖", "黄油"],
      steps: ["准备食材", "混合材料", "塑形装饰", "烘焙品尝"],
    },
    {
      id: "5",
      title: "音乐节拍游戏",
      category: "音乐",
      difficulty: 1,
      duration: "30分钟",
      description: "通过简单的乐器和节拍游戏培养音乐感",
      educationalValue: "提高音乐感知和节奏感",
      ageGroup: "3-4",
      materials: ["小鼓", "铃铛", "音乐播放器"],
      steps: ["热身律动", "节拍练习", "自由创作", "表演分享"],
    },
    {
      id: "6",
      title: "植物观察日记",
      category: "学习",
      difficulty: 2,
      duration: "每天15分钟",
      description: "种植小植物，每天观察记录成长过程",
      educationalValue: "培养观察力和责任心",
      ageGroup: "5-6",
      materials: ["种子", "花盆", "土壤", "记录本"],
      steps: ["播种", "浇水", "观察记录", "分享发现"],
    },
  ]

  const categories = ["全部", "学习", "运动", "家务", "社交", "手工", "音乐", "科学", "责任"]

  const filteredActivities = extendedActivities.filter((activity) => {
    const categoryMatch = selectedCategory === "全部" || activity.category === selectedCategory
    const ageMatch = selectedAge === "全部年龄" || activity.ageGroup === selectedAge
    const searchMatch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    return categoryMatch && ageMatch && searchMatch
  })

  const toggleFavorite = (activityId: string) => {
    setFavorites((prev) => (prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId]))
  }

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < difficulty ? "text-yellow-400" : "text-gray-300"}`}>
        ⭐
      </span>
    ))
  }

  return (
    <div className="p-8 pt-20 md:pt-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">亲子活动提案</h1>
        <p className="text-gray-600">精心设计的亲子时光，让成长更有趣 🎨</p>
      </div>

      {/* 搜索框 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="relative">
          <span className="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            search
          </span>
          <Input
            placeholder="搜索活动名称或描述..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 border-0 bg-gray-50 rounded-xl text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* 筛选区域 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        {/* 年龄段筛选 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3">年龄段:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedAge("全部年龄")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedAge === "全部年龄"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              全部年龄
            </button>
            {ageGroups.map((age) => (
              <button
                key={age.value}
                onClick={() => setSelectedAge(age.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedAge === age.value
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {age.label}
              </button>
            ))}
          </div>
        </div>

        {/* 活动分类筛选 */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">活动分类:</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category !== "全部" ? categoryIcons[category as keyof typeof categoryIcons] : "apps"
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className="material-icons text-sm">{Icon}</span>
                  {category}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 今日推荐 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-icons text-blue-500">recommend</span>
          <h2 className="text-xl font-bold text-gray-800">今日推荐</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {extendedActivities.slice(0, 3).map((activity, index) => {
            const bgColors = ["bg-orange-50", "bg-green-50", "bg-purple-50"]
            const textColors = ["text-orange-600", "text-green-600", "text-purple-600"]
            const badgeColors = [
              "bg-orange-100 text-orange-700",
              "bg-green-100 text-green-700",
              "bg-purple-100 text-purple-700",
            ]

            return (
              <div key={activity.id} className={`${bgColors[index]} rounded-2xl p-6 border border-gray-100`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{index === 0 ? "🎨" : index === 1 ? "🌳" : "🔬"}</span>
                  <h3 className="font-bold text-gray-800">{activity.title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{activity.description}</p>
                <div className="flex items-center justify-between">
                  <Badge className={badgeColors[index]}>{activity.category}</Badge>
                  <Button size="sm" className={`${textColors[index]} hover:bg-white/50`} variant="ghost">
                    查看详情 →
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 活动列表 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => {
          const CategoryIcon = categoryIcons[activity.category as keyof typeof categoryIcons]
          const isFavorite = favorites.includes(activity.id)

          return (
            <div
              key={activity.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <span className="material-icons text-blue-500 text-lg">{CategoryIcon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{activity.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-blue-100 text-blue-700 text-xs">{activity.category}</Badge>
                      {activity.ageGroup && (
                        <Badge className="bg-gray-100 text-gray-600 text-xs">{activity.ageGroup}岁</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(activity.id)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <span className={`material-icons text-lg ${isFavorite ? "text-red-500" : "text-gray-400"}`}>
                    {isFavorite ? "favorite" : "favorite_border"}
                  </span>
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-4">{activity.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">难度等级</span>
                  <div className="flex items-center">{getDifficultyStars(activity.difficulty)}</div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">所需时长</span>
                  <span className="text-sm font-medium text-gray-700">{activity.duration}</span>
                </div>
              </div>

              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl">开始活动</Button>
            </div>
          )
        })}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <span className="material-icons text-5xl text-gray-400 mb-4">search_off</span>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">没有找到相关活动</h3>
          <p className="text-gray-500">试试调整筛选条件或搜索其他关键词吧！</p>
        </div>
      )}
    </div>
  )
}
