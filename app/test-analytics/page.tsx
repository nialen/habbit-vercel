"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { analytics } from "@/lib/analytics"

export default function TestAnalyticsPage() {
  const [eventCount, setEventCount] = useState(0)
  const [lastEvent, setLastEvent] = useState<string>("")
  const [plausibleLoaded, setPlausibleLoaded] = useState(false)

  useEffect(() => {
    // 检查Plausible是否已加载
    const checkPlausible = () => {
      if (typeof window !== "undefined") {
        setPlausibleLoaded(!!window.plausible)
      }
    }
    
    checkPlausible()
    // 延迟再次检查，以防脚本异步加载
    const timer = setTimeout(checkPlausible, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const testEvent = (eventName: string, eventFn: () => void) => {
    eventFn()
    setEventCount(prev => prev + 1)
    setLastEvent(eventName)
  }

  return (
    <div className="p-8 pt-20 md:pt-8">
      <header className="mb-8">
        <h2 className="text-3xl font-semibold text-sky-900">📊 Plausible Analytics 测试</h2>
        <p className="text-sky-700">测试分析事件是否正常工作</p>
      </header>

      {/* 状态显示 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>📈 分析状态</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">环境</p>
              <p className="font-semibold">
                {process.env.NODE_ENV === "production" ? "🚀 生产环境" : "🔧 开发环境"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Plausible状态</p>
              <p className="font-semibold">
                {plausibleLoaded 
                  ? "✅ 已加载" 
                  : process.env.NODE_ENV === "production" 
                    ? "❌ 未加载" 
                    : "🔧 开发模式"
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">测试事件计数</p>
              <p className="font-semibold">{eventCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">最后事件</p>
              <p className="font-semibold text-sm">{lastEvent || "无"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 测试按钮 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎯 习惯事件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={() => testEvent("Habit Created", () => analytics.habit.created("测试习惯"))}
              className="w-full"
              variant="outline"
            >
              创建习惯
            </Button>
            <Button 
              onClick={() => testEvent("Habit Completed", () => analytics.habit.completed("测试习惯"))}
              className="w-full"
              variant="outline"
            >
              完成习惯
            </Button>
            <Button 
              onClick={() => testEvent("Habit Streak", () => analytics.habit.streak(7))}
              className="w-full"
              variant="outline"
            >
              连续7天
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🤖 AI事件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={() => testEvent("AI Question", () => analytics.ai.question("育儿咨询"))}
              className="w-full"
              variant="outline"
            >
              AI咨询
            </Button>
            <Button 
              onClick={() => testEvent("AI Suggestion", () => analytics.ai.suggestion("习惯建议"))}
              className="w-full"
              variant="outline"
            >
              AI建议
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">👥 用户事件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={() => testEvent("User Signup", () => analytics.user.signup("email"))}
              className="w-full"
              variant="outline"
            >
              用户注册
            </Button>
            <Button 
              onClick={() => testEvent("User Login", () => analytics.user.login("email"))}
              className="w-full"
              variant="outline"
            >
              用户登录
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎁 奖励事件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={() => testEvent("Points Earned", () => analytics.reward.earned(10))}
              className="w-full"
              variant="outline"
            >
              获得积分
            </Button>
            <Button 
              onClick={() => testEvent("Reward Redeemed", () => analytics.reward.redeemed("贴纸奖励", 50))}
              className="w-full"
              variant="outline"
            >
              兑换奖励
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🏠 社区事件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={() => testEvent("Community Post", () => analytics.community.postCreated("育儿经验"))}
              className="w-full"
              variant="outline"
            >
              发布帖子
            </Button>
            <Button 
              onClick={() => testEvent("Event Joined", () => analytics.community.eventJoined("线上活动"))}
              className="w-full"
              variant="outline"
            >
              参加活动
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🔧 自定义事件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={() => testEvent("Custom Event", () => analytics.track("Test Button Click", { button: "analytics-test" }))}
              className="w-full"
              variant="outline"
            >
              自定义事件
            </Button>
            <Button 
              onClick={() => testEvent("Page View", () => analytics.pageview("/test-analytics"))}
              className="w-full"
              variant="outline"
            >
              页面浏览
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 说明信息 */}
      <Card>
        <CardHeader>
          <CardTitle>📝 使用说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">🔧 开发环境</h4>
              <p>在开发环境中，事件会在浏览器控制台显示调试信息，但不会发送到Plausible。</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🚀 生产环境</h4>
              <p>在生产环境中，事件会实际发送到Plausible Analytics。请确保：</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>域名配置正确 (当前: habitkids.online)</li>
                <li>在Plausible中添加了正确的域名</li>
                <li>网站已部署到Vercel或其他生产环境</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📊 查看数据</h4>
              <p>访问 <a href="https://plausible.io/habitkids.online" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Plausible Dashboard</a> 查看实时数据。</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 