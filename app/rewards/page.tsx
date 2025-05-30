"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/components/providers"

interface Reward {
  id: string
  name: string
  description: string
  points: number
  category: "实物" | "体验" | "特权"
  image: string
  stock: number
  popularity: number
}

export default function RewardsPage() {
  const { habits } = useApp()
  const [selectedCategory, setSelectedCategory] = useState<string>("全部")
  const [exchangeHistory, setExchangeHistory] = useState<any[]>([])

  // 计算总积分
  const totalPoints = habits.reduce((sum, habit) => sum + habit.streak * 10, 0)
  const [currentPoints, setCurrentPoints] = useState(totalPoints)

  // 奖励商品数据
  const rewards: Reward[] = [
    {
      id: "1",
      name: "精美贴纸套装",
      description: "包含50张可爱卡通贴纸，可以装饰日记本和作业本",
      points: 50,
      category: "实物",
      image: "🎨",
      stock: 20,
      popularity: 95,
    },
    {
      id: "2",
      name: "小玩具汽车",
      description: "合金材质小汽车模型，做工精细，适合收藏",
      points: 100,
      category: "实物",
      image: "🚗",
      stock: 15,
      popularity: 88,
    },
    {
      id: "3",
      name: "亲子电影时光",
      description: "和爸爸妈妈一起看一场喜欢的电影，还有爆米花哦",
      points: 80,
      category: "体验",
      image: "🎬",
      stock: 999,
      popularity: 92,
    },
    {
      id: "4",
      name: "周末晚睡30分钟",
      description: "周末可以比平时晚睡30分钟的特殊权限",
      points: 60,
      category: "特权",
      image: "🌙",
      stock: 999,
      popularity: 85,
    },
    {
      id: "5",
      name: "儿童绘本",
      description: "精选优质儿童绘本，培养阅读兴趣",
      points: 120,
      category: "实物",
      image: "📚",
      stock: 10,
      popularity: 90,
    },
    {
      id: "6",
      name: "游乐园一日游",
      description: "和家人一起去游乐园玩一整天",
      points: 300,
      category: "体验",
      image: "🎡",
      stock: 5,
      popularity: 98,
    },
    {
      id: "7",
      name: "选择今天晚餐",
      description: "可以决定今天全家吃什么晚餐的特权",
      points: 40,
      category: "特权",
      image: "🍽️",
      stock: 999,
      popularity: 75,
    },
    {
      id: "8",
      name: "乐高积木套装",
      description: "小型乐高积木套装，锻炼动手能力",
      points: 200,
      category: "实物",
      image: "🧱",
      stock: 8,
      popularity: 94,
    },
  ]

  const categories = ["全部", "实物", "体验", "特权"]

  const filteredRewards = rewards.filter(
    (reward) => selectedCategory === "全部" || reward.category === selectedCategory,
  )

  // 兑换奖励
  const exchangeReward = (reward: Reward) => {
    if (currentPoints >= reward.points) {
      setCurrentPoints((prev) => prev - reward.points)
      const newExchange = {
        id: Date.now().toString(),
        rewardName: reward.name,
        points: reward.points,
        date: new Date().toLocaleDateString(),
        status: "已兑换",
      }
      setExchangeHistory((prev) => [newExchange, ...prev])
      alert(`成功兑换 ${reward.name}！`)
    } else {
      alert("积分不足，继续加油完成习惯吧！")
    }
  }

  // 获取分类颜色
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "实物":
        return "bg-blue-100 text-blue-700"
      case "体验":
        return "bg-green-100 text-green-700"
      case "特权":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="p-8 pt-20 md:pt-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">奖励兑换</h1>
        <p className="text-gray-600">用你的努力换取心仪的奖励 🎁</p>
      </div>

      {/* 积分余额 */}
      <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <span className="material-icons text-3xl text-yellow-600">stars</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">我的积分</h2>
                <p className="text-gray-600">通过完成习惯获得积分</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-yellow-600">{currentPoints}</p>
              <p className="text-sm text-gray-500">可用积分</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 积分获取规则 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="material-icons text-blue-500">info</span>
            积分获取规则
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
              <span className="material-icons text-green-500">check_circle</span>
              <div>
                <p className="font-semibold text-green-800">完成习惯</p>
                <p className="text-sm text-green-600">每次打卡 +10 积分</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
              <span className="material-icons text-blue-500">local_fire_department</span>
              <div>
                <p className="font-semibold text-blue-800">连续打卡</p>
                <p className="text-sm text-blue-600">连续7天 +50 积分</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
              <span className="material-icons text-purple-500">emoji_events</span>
              <div>
                <p className="font-semibold text-purple-800">获得成就</p>
                <p className="text-sm text-purple-600">每个成就 +100 积分</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 分类筛选 */}
      <div className="flex gap-2 mb-6">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* 奖励商品网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredRewards.map((reward) => (
          <Card key={reward.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-3">
                  {reward.image}
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{reward.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{reward.description}</p>

                <div className="flex items-center justify-center gap-2 mb-3">
                  <Badge className={getCategoryColor(reward.category)}>{reward.category}</Badge>
                  {reward.popularity >= 90 && <Badge className="bg-red-100 text-red-700">热门</Badge>}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">所需积分</span>
                  <div className="flex items-center gap-1">
                    <span className="material-icons text-yellow-500 text-sm">star</span>
                    <span className="font-bold text-lg text-gray-800">{reward.points}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">库存</span>
                  <span className="text-sm font-medium text-gray-700">
                    {reward.stock === 999 ? "充足" : `${reward.stock}件`}
                  </span>
                </div>

                <Button
                  onClick={() => exchangeReward(reward)}
                  disabled={currentPoints < reward.points || reward.stock === 0}
                  className={`w-full ${
                    currentPoints >= reward.points && reward.stock > 0
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-300 hover:bg-gray-300 cursor-not-allowed text-gray-500"
                  }`}
                >
                  {currentPoints >= reward.points ? "立即兑换" : "积分不足"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 兑换历史 */}
      {exchangeHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="material-icons text-green-500">history</span>
              兑换历史
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exchangeHistory.map((exchange) => (
                <div key={exchange.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-gray-800">{exchange.rewardName}</h4>
                    <p className="text-sm text-gray-500">{exchange.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">-{exchange.points} 积分</p>
                    <Badge className="bg-green-100 text-green-700">{exchange.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
