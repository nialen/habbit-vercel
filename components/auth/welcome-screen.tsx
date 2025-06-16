"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowRight, Star, Target, Award } from "lucide-react"

export function WelcomeScreen() {
  const router = useRouter()

  const handleLogin = () => {
    router.push("/auth")
  }

  return (
    <div className="gradient-background relative overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* 装饰性浮动元素 */}
        <div className="floating-elements">
          <div className="floating-star" style={{ top: '8%', left: '10%', fontSize: '2rem' }}>⭐</div>
          <div className="floating-cloud" style={{ top: '12%', right: '12%', fontSize: '2.5rem' }}>☁️</div>
          <div className="floating-star" style={{ top: '20%', right: '25%', fontSize: '1.5rem' }}>✨</div>
          <div className="floating-cloud" style={{ bottom: '25%', left: '8%', fontSize: '2rem' }}>☁️</div>
          <div className="floating-star" style={{ bottom: '12%', right: '18%', fontSize: '1.8rem' }}>⭐</div>
        </div>

        <div className="text-center mb-16 relative z-10">
          <div className="kids-badge inline-flex items-center gap-2 mb-8 text-lg font-bold">
            <Star className="w-5 h-5" />
            儿童成长专家推荐 ⭐⭐⭐⭐⭐
          </div>
          
          <h1 className="font-comic-neue text-5xl md:text-7xl font-bold text-kidsPrimary-700 mb-8 leading-tight">
            <span className="text-6xl md:text-8xl">🌟</span>
            <br />
            星航成长营
            <span className="block text-transparent bg-gradient-to-r from-kidsPurple-500 to-kidsAccent-500 bg-clip-text text-4xl md:text-6xl mt-2">StarVoyage</span>
          </h1>
          
          <p className="text-2xl text-kidsPrimary-600 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            帮助孩子养成好习惯，让每一天都充满成长的力量 ✨
          </p>
          
          <button 
            onClick={handleLogin}
            className="kids-button text-xl px-12 py-6 shadow-2xl font-comic-neue"
          >
            🌟 开始成长之旅 <ArrowRight className="ml-3 w-6 h-6" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 relative z-10">
          <div className="kids-card p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-kidsPrimary-100 to-kidsPrimary-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Target className="w-10 h-10 text-kidsPrimary-600" />
            </div>
            <h3 className="font-comic-neue text-2xl font-bold text-kidsPrimary-700 mb-4 flex items-center justify-center gap-2">
              <span>📚</span>
              习惯养成
            </h3>
            <p className="text-kidsPrimary-600 text-lg leading-relaxed">科学的习惯培养体系，让好习惯自然而然养成</p>
          </div>
          
          <div className="kids-card p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-kidsPurple-100 to-kidsPurple-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Star className="w-10 h-10 text-kidsPurple-600" />
            </div>
            <h3 className="font-comic-neue text-2xl font-bold text-kidsPrimary-700 mb-4 flex items-center justify-center gap-2">
              <span>🤖</span>
              AI 智能顾问
            </h3>
            <p className="text-kidsPrimary-600 text-lg leading-relaxed">专业的育儿建议，智能陪伴您的教育之路</p>
          </div>
          
          <div className="kids-card p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-kidsAccent-100 to-kidsAccent-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Award className="w-10 h-10 text-kidsAccent-600" />
            </div>
            <h3 className="font-comic-neue text-2xl font-bold text-kidsPrimary-700 mb-4 flex items-center justify-center gap-2">
              <span>🎨</span>
              亲子互动
            </h3>
            <p className="text-kidsPrimary-600 text-lg leading-relaxed">丰富的亲子活动，增进家庭温馨感情</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="kids-card p-10 mb-16 relative z-10">
          <h2 className="font-comic-neue text-3xl font-bold text-kidsPrimary-700 text-center mb-8 flex items-center justify-center gap-3">
            <span className="text-4xl">📊</span>
            成长数据大揭秘
            <span className="text-4xl">🎯</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-4 rounded-2xl bg-kidsPrimary-50 border-2 border-kidsPrimary-200">
              <div className="font-comic-neue text-4xl font-bold text-kidsPrimary-600 mb-3 flex items-center justify-center gap-2">
                <span>📚</span>
                1000+
              </div>
              <div className="text-kidsPrimary-700 font-semibold">已培养好习惯</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-kidsPurple-50 border-2 border-kidsPurple-200">
              <div className="font-comic-neue text-4xl font-bold text-kidsPurple-600 mb-3 flex items-center justify-center gap-2">
                <span>👦👧</span>
                500+
              </div>
              <div className="text-kidsPrimary-700 font-semibold">活跃小用户</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-kidsSecondary-50 border-2 border-kidsSecondary-200">
              <div className="font-comic-neue text-4xl font-bold text-kidsSecondary-600 mb-3 flex items-center justify-center gap-2">
                <span>💖</span>
                95%
              </div>
              <div className="text-kidsPrimary-700 font-semibold">家长满意度</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-kidsAccent-50 border-2 border-kidsAccent-200">
              <div className="font-comic-neue text-4xl font-bold text-kidsAccent-600 mb-3 flex items-center justify-center gap-2">
                <span>🤖</span>
                24/7
              </div>
              <div className="text-kidsPrimary-700 font-semibold">智能陪伴</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center kids-card p-12 relative z-10 bg-gradient-to-r from-kidsPrimary-100 to-kidsPurple-100 border-4 border-kidsPrimary-300">
          <div className="text-6xl mb-6">🌈</div>
          <h2 className="font-comic-neue text-3xl md:text-4xl font-bold mb-6 text-kidsPrimary-700 leading-tight">
            让孩子在快乐中成长
            <span className="block text-2xl md:text-3xl mt-2 text-transparent bg-gradient-to-r from-kidsPurple-500 to-kidsAccent-500 bg-clip-text">每一天都是新的开始 ✨</span>
          </h2>
          <p className="text-kidsPrimary-600 mb-8 text-xl leading-relaxed font-medium max-w-2xl mx-auto">
            现在就开始，为孩子的未来播下好习惯的种子 🌱
          </p>
          <button 
            onClick={handleLogin}
            className="kids-button text-xl px-12 py-6 shadow-2xl font-comic-neue"
          >
            🚀 立即开始冒险 <ArrowRight className="ml-3 w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}
