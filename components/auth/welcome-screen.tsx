"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowRight, Star, TrendingUp, Brain, Users, Sparkles, Heart, Target } from "lucide-react"

export function WelcomeScreen() {
  const router = useRouter()

  const handleLogin = () => {
    router.push("/auth")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* 现代几何装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 渐变圆形装饰 */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-32 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-indigo-200/25 to-purple-200/25 rounded-full blur-3xl"></div>

        {/* 浮动的几何形状 */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-400/60 rounded-full animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/5 w-2 h-2 bg-pink-400/60 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-indigo-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* 顶部导航栏 */}
      <nav className="relative z-20 w-full px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">星航成长</span>
          </div>

          {/* 导航链接和按钮 */}
          <div className="flex items-center gap-8">
            <button
              onClick={handleLogin}
              className="text-lg text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              登录
            </button>
            <Button
              onClick={handleLogin}
              className="bg-transparent border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-6 py-2 text-base rounded-xl font-semibold transition-all duration-300"
              variant="outline"
            >
              立即开始
            </Button>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* 标题区 */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100/80 backdrop-blur-sm px-4 py-2 rounded-full text-purple-700 font-medium mb-8">
              <Star className="w-4 h-4" />
              <span>让好习惯成为孩子的超能力</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
              <span className="text-gray-900">培养孩子的</span>
              <br />
              <span className="text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text">
                好习惯之旅
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
              AI智能陪伴 · 科学养成方法 · 让每个好习惯都闪闪发光
            </p>
          </div>

          {/* 用户证言卡片 */}
          <div className="mb-16 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    小M
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-semibold text-gray-800">明明妈妈</p>
                    <p className="text-sm text-gray-500">6岁男孩家长</p>
                  </div>
                </div>

                <div className="hidden md:block w-px h-16 bg-gray-200"></div>

                <div className="text-left max-w-md">
                  <p className="text-lg text-gray-700 mb-3 leading-relaxed">
                    "用了3周，明明现在每天主动整理玩具，还会提醒我们刷牙时间到了！"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">连续打卡21天</span>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <Target className="w-3 h-3" />
                      <span>3个习惯养成</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA按钮区 */}
          <div className="mb-20">
            <Button
              onClick={handleLogin}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              开始培养好习惯
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>

            <p className="text-base text-gray-500 mt-4 font-medium">3分钟完成设置，开启21天习惯养成计划</p>
          </div>

          {/* 社会证明 */}
          <div className="mb-20">
            <div className="flex items-center justify-center gap-8 flex-wrap text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-600" />
                </div>
                <span className="font-semibold">4.9分好评</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-semibold">1000+ 家庭信赖</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-semibold">专业儿童心理学支持</span>
              </div>
            </div>
          </div>

          {/* 功能特色区 */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* 智能追踪 */}
            <div className="group">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/80 transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">智能追踪</h3>
                <p className="text-gray-600 text-lg leading-relaxed">科学记录孩子的成长轨迹，可视化展示习惯养成进度</p>
              </div>
            </div>

            {/* AI陪伴 */}
            <div className="group">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/80 transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">AI智能陪伴</h3>
                <p className="text-gray-600 text-lg leading-relaxed">个性化育儿建议，智能提醒，让习惯养成更轻松</p>
              </div>
            </div>

            {/* 亲子互动 */}
            <div className="group">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/80 transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">亲子互动</h3>
                <p className="text-gray-600 text-lg leading-relaxed">丰富的家庭活动和奖励机制，增进亲子关系</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
