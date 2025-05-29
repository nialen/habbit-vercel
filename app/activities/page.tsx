"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  const [selectedAge, setSelectedAge] = useState<string>("全部")
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])

  // 扩展的活动数据
  const extendedActivities = [
    ...activities,
    {
      id: "3",
      title: "制作彩虹实验",
      category: "科学",
      difficulty: 3,
      duration: "45分钟",
      description: "用简单的材料制作彩虹，学习光的折射原理",
      educationalValue: "培养科学思维和观察能力",
      ageGroup: "5-6",
      materials: ["透明杯子", "水", "手电筒", "三棱镜或CD"],
      steps: ["准备材料", "调整光线角度", "观察彩虹现象", "记录观察结果"],
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
      materials: ["面粉", "鸡蛋", "糖", "黄油", "烘焙工具"],
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
      category: "科学",
      difficulty: 2,
      duration: "每天15分钟",
      description: "种植小植物，每天观察记录成长过程",
      educationalValue: "培养观察力和责任心",
      ageGroup: "5-6",
      materials: ["种子", "花盆", "土壤", "观察记录本"],
      steps: ["播种", "浇水", "观察记录", "分享发现"],
    },
    {
      id: "7",
      title: "创意拼贴画",
      category: "手工",
      difficulty: 2,
      duration: "60分钟",
      description: "用各种材料创作独特的拼贴艺术作品",
      educationalValue: "发展创造力和精细动作技能",
      ageGroup: "5-6",
      materials: ["彩纸", "胶水", "剪刀", "画笔", "装饰材料"],
      steps: ["构思设计", "剪切材料", "拼贴组合", "装饰完善"],
    },
    {
      id: "8",
      title: "家庭小剧场",
      category: "社交",
      difficulty: 3,
      duration: "120分钟",
      description: "创作并表演简单的家庭小话剧",
      educationalValue: "提高表达能力和自信心",
      ageGroup: "7-8",
      materials: ["简单道具", "服装", "剧本纸"],
      steps: ["编写剧本", "分配角色", "排练表演", "正式演出"],
    },
  ]

  const categories = ["全部", "学习", "运动", "家务", "社交", "手工", "音乐", "科学", "烹饪"]

  const filteredActivities = extendedActivities.filter((activity) => {
    const categoryMatch = selectedCategory === "全部" || activity.category === selectedCategory
    const ageMatch = selectedAge === "全部" || activity.ageGroup === selectedAge
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
      <span key={i} className={`material-icons text-sm ${i < difficulty ? "text-yellow-500" : "text-gray-300"}`}>
        star
      </span>
    ))
  }

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-sky-900 mb-2">亲子活动提案</h1>
        <p className="text-sky-700 text-lg">精心设计的亲子时光，让成长更有趣 🎨</p>
      </div>

      {/* 搜索和筛选区域 */}
      <Card className="card-hover mb-8">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* 搜索框 */}
            <div className="flex items-center gap-2">
              <span className="material-icons text-sky-600">search</span>
              <Input
                placeholder="搜索活动名称或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border-sky-200 focus:border-sky-400"
              />
            </div>

            {/* 年龄筛选 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-icons text-sky-600">child_care</span>
                <h3 className="font-semibold text-sky-800">适合年龄</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedAge("全部")}
                  className={`px-4 py-2 rounded-xl border transition-all ${
                    selectedAge === "全部"
                      ? "border-sky-500 bg-sky-500 text-white"
                      : "border-gray-200 hover:border-sky-300 hover:bg-sky-50"
                  }`}
                >
                  全部年龄
                </button>
                {ageGroups.map((age) => (
                  <button
                    key={age.value}
                    onClick={() => setSelectedAge(age.value)}
                    className={`px-4 py-2 rounded-xl border transition-all ${
                      selectedAge === age.value
                        ? "border-sky-500 bg-sky-500 text-white"
                        : "border-gray-200 hover:border-sky-300 hover:bg-sky-50"
                    }`}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 分类筛选 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-icons text-sky-600">category</span>
                <h3 className="font-semibold text-sky-800">活动分类</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const Icon = category !== "全部" ? categoryIcons[category as keyof typeof categoryIcons] : "apps"
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                        selectedCategory === category
                          ? "border-sky-500 bg-sky-500 text-white"
                          : "border-gray-200 hover:border-sky-300 hover:bg-sky-50"
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
        </CardContent>
      </Card>

      {/* 推荐活动轮播 */}
      <Card className="card-hover mb-8 bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="material-icons text-sky-500">recommend</span>
            今日推荐
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {extendedActivities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="bg-white p-4 rounded-xl border border-sky-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-icons text-sky-500">
                    {categoryIcons[activity.category as keyof typeof categoryIcons]}
                  </span>
                  <h4 className="font-semibold text-sky-800">{activity.title}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-sky-100 text-sky-700">{activity.category}</Badge>
                  <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white">
                    查看详情
                  </Button>
                </div>
              </div>
            ))}
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
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-blue-100 rounded-2xl flex items-center justify-center">
                      <span className="material-icons text-sky-600">{CategoryIcon}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {activity.category}
                        </Badge>
                        {activity.ageGroup && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">{activity.ageGroup}岁</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(activity.id)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <span className={`material-icons ${isFavorite ? "text-red-500" : "text-gray-400"}`}>
                      {isFavorite ? "favorite" : "favorite_border"}
                    </span>
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
                      <span className="material-icons text-sm text-gray-400">schedule</span>
                      <span className="text-sm font-medium">{activity.duration}</span>
                    </div>
                  </div>
                </div>

                {/* 材料清单 */}
                {activity.materials && (
                  <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                    <p className="text-sm font-medium text-green-800 mb-1 flex items-center gap-1">
                      <span className="material-icons text-sm">inventory</span>
                      所需材料
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {activity.materials.slice(0, 3).map((material, index) => (
                        <Badge key={index} className="bg-green-100 text-green-700 text-xs">
                          {material}
                        </Badge>
                      ))}
                      {activity.materials.length > 3 && (
                        <Badge className="bg-gray-100 text-gray-600 text-xs">+{activity.materials.length - 3}</Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
                  <p className="text-sm font-medium text-orange-800 mb-1 flex items-center gap-1">
                    <span className="material-icons text-sm">psychology</span>
                    教育意义
                  </p>
                  <p className="text-sm text-orange-700">{activity.educationalValue}</p>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-sky-500 hover:bg-sky-600 text-white">
                    <span className="material-icons mr-1 text-sm">play_arrow</span>
                    开始活动
                  </Button>
                  <Button variant="outline" size="sm" className="border-sky-300 text-sky-700">
                    详情
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 活动统计 */}
      <Card className="card-hover mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="material-icons text-sky-500">analytics</span>
            活动统计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-sky-50 rounded-xl">
              <span className="material-icons text-2xl text-sky-500 mb-2">event_available</span>
              <p className="text-2xl font-bold text-sky-800">{extendedActivities.length}</p>
              <p className="text-sm text-sky-600">总活动数</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <span className="material-icons text-2xl text-green-500 mb-2">favorite</span>
              <p className="text-2xl font-bold text-green-800">{favorites.length}</p>
              <p className="text-sm text-green-600">收藏活动</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <span className="material-icons text-2xl text-orange-500 mb-2">category</span>
              <p className="text-2xl font-bold text-orange-800">{categories.length - 1}</p>
              <p className="text-sm text-orange-600">活动分类</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <span className="material-icons text-2xl text-purple-500 mb-2">child_care</span>
              <p className="text-2xl font-bold text-purple-800">{ageGroups.length}</p>
              <p className="text-sm text-purple-600">年龄段</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 活动小贴士 */}
      <Card className="card-hover mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
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
              <ul className="text-orange-700 text-sm space-y-1">
                <li>• 考虑孩子的兴趣和能力水平</li>
                <li>• 选择合适的时间和环境</li>
                <li>• 准备必要的材料和工具</li>
                <li>• 确保活动的安全性</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-orange-800">活动过程中：</h4>
              <ul className="text-orange-700 text-sm space-y-1">
                <li>• 鼓励孩子主动参与和思考</li>
                <li>• 及时给予正面反馈</li>
                <li>• 享受亲子互动的美好时光</li>
                <li>• 记录孩子的成长瞬间</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredActivities.length === 0 && (
        <Card className="card-hover text-center py-12">
          <CardContent>
            <span className="material-icons text-5xl text-gray-400 mb-4">search_off</span>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">没有找到相关活动</h3>
            <p className="text-gray-500">试试调整筛选条件或搜索其他关键词吧！</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
