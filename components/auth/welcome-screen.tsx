"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowRight, Star, Users, TrendingUp } from "lucide-react"

export function WelcomeScreen() {
  const router = useRouter()

  const handleLogin = () => {
    router.push("/auth")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
      {/* 顶部导航栏 */}
      <nav className="relative z-20 w-full px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo - 只保留图标 */}
          <div className="flex items-center">
            <div className="w-12 h-12">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <use href="/sprites/rocket.svg#rocket" />
              </svg>
            </div>
          </div>

          {/* 导航链接和按钮 */}
          <div className="flex items-center gap-8">
            {/* 登录链接 */}
            <button
              onClick={handleLogin}
              className="text-lg text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              登录
            </button>

            {/* CTA按钮 */}
            <Button
              onClick={handleLogin}
              className="bg-transparent border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-3 text-lg rounded-2xl font-semibold transition-all duration-300"
              variant="outline"
            >
              立即开始
            </Button>
          </div>
        </div>
      </nav>

      {/* 可爱的装饰元素 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 使用项目中的可爱sprite图标 */}

        {/* 左上角 - 可爱的兔子 */}
        <div
          className="absolute top-32 left-8 w-16 h-16 animate-bounce opacity-80"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <use href="/sprites/badge-bunny.svg#badge-bunny" />
          </svg>
        </div>

        {/* 右上角 - 考拉 */}
        <div className="absolute top-36 right-12 w-14 h-14 animate-pulse opacity-80" style={{ animationDelay: "1s" }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <use href="/sprites/chart-koala.svg#chart-koala" />
          </svg>
        </div>

        {/* 左侧中间 - 火箭 */}
        <div
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 animate-bounce opacity-80"
          style={{ animationDelay: "2s", animationDuration: "4s" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <use href="/sprites/rocket.svg#rocket" />
          </svg>
        </div>

        {/* 右侧中间 - 奔跑的熊猫 */}
        <div
          className="absolute right-8 top-1/2 transform -translate-y-1/2 w-16 h-16 animate-pulse opacity-80"
          style={{ animationDelay: "1.5s" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <use href="/sprites/panda-run.svg#panda-run" />
          </svg>
        </div>

        {/* 底部左侧 - 太空猫 */}
        <div
          className="absolute bottom-20 left-16 w-14 h-14 animate-bounce opacity-80"
          style={{ animationDelay: "0.5s", animationDuration: "3.5s" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <use href="/sprites/gift-astrocat.svg#gift-astrocat" />
          </svg>
        </div>

        {/* 自定义可爱的CSS装饰 */}

        {/* 彩色圆点装饰 */}
        <div
          className="absolute top-44 left-32 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse opacity-70"
          style={{ animationDelay: "2.5s" }}
        ></div>
        <div
          className="absolute top-56 right-28 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-bounce opacity-70"
          style={{ animationDelay: "1.8s", animationDuration: "2.5s" }}
        ></div>
        <div
          className="absolute bottom-32 right-20 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse opacity-70"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* 可爱的星星形状 */}
        <div className="absolute top-1/4 left-1/4 animate-pulse opacity-60" style={{ animationDelay: "4s" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" className="text-yellow-400 fill-current">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        <div
          className="absolute top-1/3 right-1/4 animate-bounce opacity-60"
          style={{ animationDelay: "1.2s", animationDuration: "2.8s" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" className="text-pink-400 fill-current">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        {/* 可爱的心形 */}
        <div className="absolute top-1/2 left-1/3 animate-pulse opacity-60" style={{ animationDelay: "2.8s" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" className="text-red-400 fill-current">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>

        {/* 可爱的云朵形状 */}
        <div
          className="absolute top-40 right-40 animate-bounce opacity-50"
          style={{ animationDelay: "0.8s", animationDuration: "4s" }}
        >
          <svg width="32" height="24" viewBox="0 0 32 24" className="text-blue-300 fill-current">
            <path d="M24 12c0-4.4-3.6-8-8-8-2.7 0-5.1 1.3-6.6 3.3C8.6 7.1 8 7 7.3 7 4.4 7 2 9.4 2 12.3c0 2.9 2.4 5.3 5.3 5.3h16.4c3.3 0 6-2.7 6-6 0-3.3-2.7-6-6-6h-.7z" />
          </svg>
        </div>

        <div className="absolute bottom-28 left-40 animate-pulse opacity-50" style={{ animationDelay: "3.5s" }}>
          <svg width="28" height="20" viewBox="0 0 32 24" className="text-purple-300 fill-current">
            <path d="M24 12c0-4.4-3.6-8-8-8-2.7 0-5.1 1.3-6.6 3.3C8.6 7.1 8 7 7.3 7 4.4 7 2 9.4 2 12.3c0 2.9 2.4 5.3 5.3 5.3h16.4c3.3 0 6-2.7 6-6 0-3.3-2.7-6-6-6h-.7z" />
          </svg>
        </div>

        {/* 可爱的花朵 */}
        <div
          className="absolute bottom-16 right-44 animate-bounce opacity-60"
          style={{ animationDelay: "1.5s", animationDuration: "3s" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" className="text-pink-400 fill-current">
            <circle cx="12" cy="12" r="3" />
            <circle cx="12" cy="6" r="3" />
            <circle cx="18" cy="12" r="3" />
            <circle cx="12" cy="18" r="3" />
            <circle cx="6" cy="12" r="3" />
          </svg>
        </div>

        {/* 闪烁的小点点 */}
        <div
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-60"
          style={{ animationDelay: "5s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-60"
          style={{ animationDelay: "1.8s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/5 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"
          style={{ animationDelay: "3.2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/5 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-60"
          style={{ animationDelay: "4.5s" }}
        ></div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* 主标题 - 简化设计 */}
          <div className="mb-16">
            <h1
              className="text-5xl md:text-7xl font-bold leading-tight text-gray-900 mb-6"
              style={{ fontFamily: "__Grandstander_7c07ce, __Grandstander_Fallback_7c07ce, sans-serif" }}
            >
              让孩子的好习惯
              <span className="block text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text">
                成为现实
              </span>
            </h1>
          </div>

          {/* 副标题 - 简化设计 */}
          <div className="mb-20">
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-medium max-w-4xl mx-auto">
              <span className="block mb-6">看着您孩子的习惯一天天养成！</span>
              <span className="block mb-4">星航成长营通过AI智能陪伴和科学方法，</span>
              <span className="block">让每个小习惯都闪闪发光，充满成长的魔力！</span>
            </p>
          </div>

          {/* CTA按钮 - 简化设计 */}
          <div className="mb-20">
            <Button
              onClick={handleLogin}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              立即开始
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </div>

          {/* 社会证明 - 简化设计 */}
          <div className="space-y-4 mb-24">
            <div className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-700">
              <div className="w-6 h-6">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <use href="/sprites/badge-bunny.svg#badge-bunny" />
                </svg>
              </div>
              <span className="text-purple-600 font-bold">#1</span>
              儿童习惯养成平台
            </div>

            <div className="flex items-center justify-center gap-2 text-lg text-gray-600">
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-yellow-400 fill-current">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              已被 <span className="font-bold text-purple-600">1,000+</span> 家长和孩子喜爱！
            </div>
          </div>

          {/* 核心功能亮点 - 简化设计 */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">智能追踪</h3>
              <p className="text-gray-600">科学记录孩子的成长轨迹</p>
              {/* 卡片装饰 */}
              <div className="absolute -top-2 -right-2 w-8 h-8 animate-pulse" style={{ animationDelay: "6s" }}>
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <use href="/sprites/chart-koala.svg#chart-koala" />
                </svg>
              </div>
            </div>

            <div className="p-6 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI陪伴</h3>
              <p className="text-gray-600">专业的育儿建议和智能提醒</p>
              {/* 卡片装饰 */}
              <div
                className="absolute -top-2 -right-2 w-8 h-8 animate-bounce"
                style={{ animationDelay: "7s", animationDuration: "3s" }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <use href="/sprites/ai-orb.svg#ai-orb" />
                </svg>
              </div>
            </div>

            <div className="p-6 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">亲子互动</h3>
              <p className="text-gray-600">丰富的家庭活动和奖励机制</p>
              {/* 卡片装饰 */}
              <div className="absolute -top-2 -right-2 w-8 h-8 animate-pulse" style={{ animationDelay: "8s" }}>
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <use href="/sprites/salon-group.svg#salon-group" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
