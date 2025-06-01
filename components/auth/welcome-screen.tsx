"use client"

import { useState } from "react"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Target, Users, Heart, Sparkles } from "lucide-react"

export function WelcomeScreen() {
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  if (showAuth) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {authMode === "login" ? (
            <LoginForm onSwitchToRegister={() => setAuthMode("register")} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setAuthMode("login")} />
          )}
          <div className="text-center mt-4">
            <button onClick={() => setShowAuth(false)} className="text-gray-500 hover:text-gray-700 text-sm">
              ← 返回首页
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 顶部导航 */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="StarVoyage Logo" className="h-10 w-auto" />
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setAuthMode("login")
                setShowAuth(true)
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              登录
            </Button>
            <Button
              onClick={() => {
                setAuthMode("register")
                setShowAuth(true)
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              免费注册
            </Button>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* 英雄区域 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            专业的儿童成长伙伴
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            星航成长营
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              StarVoyage
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            帮助孩子养成好习惯，促进亲子互动，让每个家庭都能享受成长的快乐时光
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => {
                setAuthMode("register")
                setShowAuth(true)
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              开始免费体验 🚀
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setAuthMode("login")
                setShowAuth(true)
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg"
            >
              已有账户登录
            </Button>
          </div>
        </div>

        {/* 功能特色 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">习惯管理</h3>
              <p className="text-gray-600 text-sm">科学的习惯养成体系，让好习惯自然而然</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">AI 智能顾问</h3>
              <p className="text-gray-600 text-sm">专业的育儿建议，24小时贴心陪伴</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">亲子活动</h3>
              <p className="text-gray-600 text-sm">丰富的亲子活动，增进家庭感情</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">家长社区</h3>
              <p className="text-gray-600 text-sm">与其他家长交流经验，共同成长</p>
            </CardContent>
          </Card>
        </div>

        {/* 统计数据 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">活跃家庭</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50,000+</div>
              <div className="text-gray-600">习惯打卡</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">1,000+</div>
              <div className="text-gray-600">亲子活动</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">98%</div>
              <div className="text-gray-600">满意度</div>
            </div>
          </div>
        </div>

        {/* 行动号召 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">准备好开始孩子的成长之旅了吗？</h2>
          <p className="text-gray-600 mb-8">加入星航成长营，让我们一起陪伴孩子健康快乐地成长</p>
          <Button
            size="lg"
            onClick={() => {
              setAuthMode("register")
              setShowAuth(true)
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-4 text-lg"
          >
            立即开始免费体验 ✨
          </Button>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 星航成长营 StarVoyage. 让每个孩子都能闪闪发光 ✨</p>
        </div>
      </footer>
    </div>
  )
}
