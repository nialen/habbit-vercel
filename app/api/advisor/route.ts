import { type NextRequest, NextResponse } from "next/server"
import { getParentingAdvice } from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    const { concern, childAge } = await request.json()

    if (!concern || !childAge) {
      return NextResponse.json({ error: "请提供完整的咨询信息" }, { status: 400 })
    }

    if (concern.length > 300) {
      return NextResponse.json({ error: "描述内容不能超过300字" }, { status: 400 })
    }

    const advice = await getParentingAdvice(concern, childAge)

    return NextResponse.json(advice)
  } catch (error) {
    console.error("AI顾问API错误:", error)
    return NextResponse.json({ 
      error: "AI顾问服务暂时不可用，请稍后再试",
      analysis: "系统正在处理您的请求，请稍后再试。",
      suggestions: ["请检查网络连接", "稍后重新提交咨询"],
      actionItems: ["等待系统恢复", "联系技术支持"]
    }, { status: 500 })
  }
}
