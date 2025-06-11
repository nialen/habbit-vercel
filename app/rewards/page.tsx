"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/components/providers"
import { useAuth } from "@/components/auth-provider"
import { PageLayout } from "@/components/page-layout"
import { useToast } from "@/hooks/use-toast"

interface Reward {
  id: string
  name: string
  description: string
  points_required: number
  category: string
  icon: string
  stock: number
}

interface Redemption {
  id: string
  reward_id: string
  points_spent: number
  redeemed_at: string
  status: string
  rewards?: Reward
}

export default function RewardsPage() {
  const { habits } = useApp()
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState<string>("全部")
  const [rewards, setRewards] = useState<Reward[]>([])
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [loading, setLoading] = useState(true)

  // 计算总积分 (每个习惯的连续天数 * 10分)
  const totalPoints = habits.reduce((sum, habit) => sum + habit.streak * 10, 0)

  // 计算已使用积分
  const usedPoints = redemptions.reduce((sum, redemption) => sum + redemption.points_spent, 0)
  const currentPoints = Math.max(0, totalPoints - usedPoints)

  const categories = ["全部", "实物", "体验", "特权"]

  // 加载奖励列表和兑换历史
  useEffect(() => {
    loadData()
  }, [user?.id])

  const loadData = async () => {
    setLoading(true)
    try {
      // 加载奖励列表
      const rewardsResponse = await fetch('/api/rewards')
      if (rewardsResponse.ok) {
        const rewardsData = await rewardsResponse.json()
        setRewards(rewardsData.rewards || [])
      }

      // 加载兑换历史
      if (user?.id) {
        const redemptionsResponse = await fetch(`/api/rewards/redemptions?userId=${user.id}`)
        if (redemptionsResponse.ok) {
          const redemptionsData = await redemptionsResponse.json()
          setRedemptions(redemptionsData.redemptions || [])
        }
      }
    } catch (error) {
      console.error('加载数据失败:', error)
      toast({
        title: "加载失败",
        description: "无法加载奖励数据，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredRewards = rewards.filter(
    (reward) => selectedCategory === "全部" || reward.category === selectedCategory,
  )

  // 兑换奖励
  const exchangeReward = async (reward: Reward) => {
    if (!user?.id) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能兑换奖励",
        variant: "destructive",
      })
      return
    }

    if (currentPoints >= reward.points_required) {
      try {
        const response = await fetch('/api/rewards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            reward_id: reward.id,
            points_spent: reward.points_required,
          }),
        })

        if (response.ok) {
          toast({
            title: "兑换成功！",
            description: `成功兑换 ${reward.name}`,
          })
          
          // 刷新兑换历史
          await loadData()
        } else {
          throw new Error('兑换失败')
        }
      } catch (error) {
        console.error('兑换奖励失败:', error)
        toast({
          title: "兑换失败",
          description: "请稍后重试",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "积分不足",
        description: "继续加油完成习惯吧！",
        variant: "destructive",
      })
    }
  }

  // 获取分类颜色
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "实物":
      case "item":
        return "bg-blue-100 text-blue-700"
      case "体验":
      case "experience":
        return "bg-green-100 text-green-700"
      case "特权":
      case "privilege":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">加载奖励数据中...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
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
                <p className="font-semibold text-purple-800">达成成就</p>
                <p className="text-sm text-purple-600">特殊成就 +100 积分</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 奖励分类筛选 */}
      <div className="mb-6">
        <div className="flex gap-2">
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
      </div>

      {/* 奖励商品网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredRewards.map((reward) => (
          <Card key={reward.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">{reward.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{reward.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <Badge className={getCategoryColor(reward.category)}>
                  {reward.category === 'item' ? '实物' : 
                   reward.category === 'experience' ? '体验' : 
                   reward.category === 'privilege' ? '特权' : reward.category}
                </Badge>
                {reward.stock > 0 && reward.stock < 999 && (
                  <span className="text-sm text-gray-500">库存: {reward.stock}</span>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-blue-500">stars</span>
                  <span className="font-bold text-xl text-blue-600">{reward.points_required}</span>
                  <span className="text-gray-500 text-sm">积分</span>
                </div>
              </div>

              <Button
                onClick={() => exchangeReward(reward)}
                disabled={currentPoints < reward.points_required || reward.stock === 0}
                className={`w-full ${
                  currentPoints >= reward.points_required && reward.stock > 0
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {currentPoints >= reward.points_required && reward.stock > 0
                  ? "立即兑换"
                  : currentPoints < reward.points_required
                    ? "积分不足"
                    : "暂时缺货"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRewards.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎁</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">暂无奖励</h3>
          <p className="text-gray-500">当前分类下没有可兑换的奖励</p>
        </div>
      )}

      {/* 兑换历史 */}
      {redemptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="material-icons text-purple-500">history</span>
              兑换历史
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {redemptions.map((redemption) => (
                <div key={redemption.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800">
                      {redemption.rewards?.name || `奖励 #${redemption.reward_id}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(redemption.redeemed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-medium">-{redemption.points_spent} 积分</p>
                    <Badge className={`${
                      redemption.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      redemption.status === 'fulfilled' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {redemption.status === 'pending' ? '待处理' :
                       redemption.status === 'fulfilled' ? '已完成' :
                       redemption.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  )
}
