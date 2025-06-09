"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/loading-spinner"

interface ImageResponse {
  success: boolean
  imageUrl?: string
  prompt?: string
  error?: string
}

export default function TestImagePage() {
  const [prompt, setPrompt] = useState("")
  const [aspectRatio, setAspectRatio] = useState("3:2")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<ImageResponse[]>([])

  const quickPrompts = [
    "一个友好的机器人在花园里向孩子们挥手",
    "彩虹色的独角兽在云朵上快乐地跳舞",
    "穿着超级英雄服装的小猫拯救世界",
    "森林里的动物朋友们在野餐",
    "太空中的宇航员小熊探索星球",
    "魔法城堡里的公主和龙成为朋友"
  ]

  const aspectRatios = [
    { label: "横版 (3:2)", value: "3:2" },
    { label: "方形 (1:1)", value: "1:1" },
    { label: "竖版 (2:3)", value: "2:3" },
    { label: "宽屏 (16:9)", value: "16:9" }
  ]

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt)
  }

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio
        }),
      })

      const data: ImageResponse = await response.json()

      setGeneratedImages(prev => [data, ...prev])

      if (data.success) {
        console.log("图片生成成功:", data.imageUrl)
      } else {
        console.error("图片生成失败:", data.error)
      }

    } catch (error) {
      console.error("生成图片时出错:", error)
      setGeneratedImages(prev => [{
        success: false,
        error: "网络错误，请稍后再试"
      }, ...prev])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-sky-900 mb-2">🎨 AI图片生成测试</h1>
        <p className="text-sky-700 text-lg">测试Replicate Ideogram V2A图片生成功能</p>
      </header>

      {/* 状态显示 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>🖼️ 生成状态</CardTitle>
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
              <p className="text-sm text-gray-600">生成数量</p>
              <p className="font-semibold">{generatedImages.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 快速提示词 */}
      <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="material-icons text-purple-500">auto_awesome</span>
            快速提示词
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickPrompts.map((quickPrompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickPrompt(quickPrompt)}
                className="p-3 text-left bg-white rounded-xl border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all"
              >
                <span className="text-sm text-gray-700">{quickPrompt}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 图片生成输入 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="material-icons text-purple-500">brush</span>
            描述您想要的图片
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="请描述您想要生成的图片，比如：一个友好的机器人在花园里教孩子们如何种花..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] resize-none border-2 border-gray-200 focus:border-purple-400 rounded-2xl"
              maxLength={500}
              disabled={isLoading}
            />
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  图片比例
                </label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aspectRatios.map((ratio) => (
                      <SelectItem key={ratio.value} value={ratio.value}>
                        {ratio.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isLoading}
                  className="bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-300"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <span className="material-icons mr-2 text-sm">create</span>
                      生成图片
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{prompt.length}/500 字</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 生成结果 */}
      {generatedImages.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🖼️ 生成结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {generatedImages.map((image, index) => (
                <div key={index} className="border rounded-xl p-4 bg-gray-50">
                  {image.success ? (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <img
                          src={image.imageUrl}
                          alt="AI生成的图片"
                          className="max-w-full h-auto rounded-lg shadow-lg"
                          onLoad={() => console.log("图片加载成功")}
                          onError={() => console.error("图片加载失败")}
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">提示词:</p>
                        <p className="text-xs bg-white p-2 rounded mt-1">{image.prompt}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (image.imageUrl) {
                              window.open(image.imageUrl, '_blank')
                            }
                          }}
                        >
                          <span className="material-icons mr-1 text-sm">open_in_new</span>
                          查看大图
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (image.imageUrl) {
                              const link = document.createElement('a')
                              link.href = image.imageUrl
                              link.download = 'generated-image.png'
                              link.click()
                            }
                          }}
                        >
                          <span className="material-icons mr-1 text-sm">download</span>
                          下载
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-red-500 mb-2">
                        <span className="material-icons">error</span>
                      </div>
                      <p className="text-red-600 font-medium">生成失败</p>
                      <p className="text-sm text-gray-600">{image.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 使用说明 */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle>📝 使用说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">🎨 关于图片生成</h4>
              <p>使用Ideogram V2A模型，专门优化适合儿童的内容。生成的图片会自动添加儿童友好的风格。</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">⏱️ 生成时间</h4>
              <p>每张图片生成大约需要30-60秒，请耐心等待。</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">💡 提示词建议</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>描述要具体清晰，包含颜色、风格、环境等</li>
                <li>避免使用可能不适合儿童的内容</li>
                <li>可以指定艺术风格：卡通、水彩、向量图等</li>
                <li>描述角色的表情和动作会让图片更生动</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 