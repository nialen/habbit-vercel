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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            儿童成长专家推荐
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            星航成长营
            <span className="block text-blue-600">StarVoyage</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            帮助孩子养成好习惯，让每一天都充满成长的力量
          </p>
          
          <Button 
            onClick={handleLogin}
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            开始成长之旅 <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">习惯养成</h3>
            <p className="text-gray-600">科学的习惯培养体系，让好习惯自然而然</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI 智能顾问</h3>
            <p className="text-gray-600">专业的育儿建议，陪伴您的教育之路</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">亲子互动</h3>
            <p className="text-gray-600">丰富的亲子活动，增进家庭感情</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">已培养好习惯</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">活跃小用户</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">家长满意度</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">智能陪伴</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            让孩子在快乐中成长
          </h2>
          <p className="text-blue-100 mb-6 text-lg">
            现在就开始，为孩子的未来播下好习惯的种子
          </p>
          <Button 
            onClick={handleLogin}
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-xl text-lg font-semibold"
          >
            立即开始 <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
