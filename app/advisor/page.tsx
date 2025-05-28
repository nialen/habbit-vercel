"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Lightbulb, CheckCircle, Send, Sparkles } from "lucide-react"
import { useApp } from "@/components/providers"
import { LoadingSpinner } from "@/components/loading-spinner"

interface AdvisorResponse {
  analysis: string
  suggestions: string[]
  actionItems: string[]
}

export default function AdvisorPage() {
  const { user } = useApp()
  const [concern, setConcern] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<AdvisorResponse | null>(null)
  const [chatHistory, setChatHistory] = useState<
    Array<{
      type: "user" | "ai"
      content: string
      timestamp: Date
    }>
  >([])

  const quickQuestions = [
    "孩子不愿意刷牙怎么办？",
    "如何培养孩子的阅读习惯？",
    "孩子总是发脾气怎么处理？",
    "怎样让孩子主动收拾玩具？",
  ]

  const handleQuickQuestion = (question: string) => {
    setConcern(question)
  }

  const handleSubmit = async () => {
    if (!concern.trim() || isLoading) return

    setIsLoading(true)

    // 添加用户消息到聊天历史
    const userMessage = {
      type: "user" as const,
      content: concern,
      timestamp: new Date(),
    }
    setChatHistory((prev) => [...prev, userMessage])

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          concern,
          childAge: user?.childAge || 6,
        }),
      })

      if (!res.ok) {
        throw new Error("请求失败")
      }

      const data: AdvisorResponse = await res.json()
      setResponse(data)

      // 添加AI回复到聊天历史
      const aiMessage = {
        type: "ai" as const,
        content: `${data.analysis}\n\n建议：${data.suggestions.join("\n")}\n\n行动清单：${data.actionItems.join("\n")}`,
        timestamp: new Date(),
      }
      setChatHistory((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("获取建议失败:", error)
      alert("获取建议失败，请稍后再试")
    } finally {
      setIsLoading(false)
      setConcern("")
    }
  }

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">AI 烦恼顾问</h1>
        <p className="text-gray-600 text-lg">专业的育儿建议，温暖的陪伴支持 💝</p>
      </div>

      {/* 快速提问 */}
      {chatHistory.length === 0 && (
        <Card className="card-hover mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-purple-500" />
              常见问题
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="p-3 text-left bg-white rounded-xl border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all"
                >
                  <span className="text-sm text-gray-700">{question}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 咨询输入区 */}
      <Card className="card-hover mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="text-purple-500" />
            描述您的困惑
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="请描述您在育儿过程中遇到的困惑或挑战，比如：孩子不愿意刷牙、总是发脾气、不爱收拾玩具等..."
              value={concern}
              onChange={(e) => setConcern(e.target.value)}
              className="min-h-[120px] resize-none border-2 border-gray-200 focus:border-purple-400 rounded-2xl"
              maxLength={300}
              disabled={isLoading}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{concern.length}/300 字</span>
              <Button
                onClick={handleSubmit}
                disabled={!concern.trim() || isLoading}
                className="bg-purple-500 hover:bg-purple-600"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    AI正在思考...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    获取建议
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI回复区域 */}
      {response && (
        <div className="space-y-6">
          <Card className="card-hover bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-blue-500" />
                原因分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{response.analysis}</p>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="text-green-500" />
                分龄建议
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {response.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-xl">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{index + 1}</Badge>
                    <p className="text-gray-700 flex-1">{suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="text-orange-500" />
                可操作清单
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {response.actionItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-xl">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-600 text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 flex-1">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 聊天历史 */}
      {chatHistory.length > 0 && (
        <Card className="card-hover mt-8">
          <CardHeader>
            <CardTitle>咨询历史</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {chatHistory.map((message, index) => (
                <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.type === "user" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 温馨提示 */}
      <Card className="card-hover mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">温馨提示</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• AI建议仅供参考，每个孩子都是独特的</li>
                <li>• 建议结合孩子的具体情况灵活调整</li>
                <li>• 如有严重问题，建议咨询专业儿童心理医生</li>
                <li>• 耐心和爱是最好的教育方式</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
