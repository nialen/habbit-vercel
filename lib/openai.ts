import { OpenAI } from "openai"

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "X-Title": "小星星习惯养成平台",
  },
})

export interface AdvisorResponse {
  analysis: string
  suggestions: string[]
  actionItems: string[]
}

export async function getParentingAdvice(concern: string, childAge: number): Promise<AdvisorResponse> {
  const prompt = `
作为一名专业的儿童心理学家和家庭教育专家，请针对以下家长的困惑提供专业建议：

家长困惑：${concern}
孩子年龄：${childAge}岁

请按以下格式回复：

## 原因分析
[分析孩子行为背后的心理原因和发展特点]

## 分龄建议
[针对${childAge}岁孩子的具体建议，考虑其认知和情感发展水平]

## 可操作清单
[提供3-5个具体可执行的行动建议]

请确保建议温和、实用，符合正面管教理念。
`

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [
        {
          role: "system",
          content: "你是一位温和、专业的儿童心理学家和家庭教育专家，擅长正面管教和亲子沟通。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const response = completion.choices[0]?.message?.content || ""

    // 解析响应
    const sections = response.split("##").filter((section) => section.trim())

    let analysis = ""
    let suggestions: string[] = []
    let actionItems: string[] = []

    sections.forEach((section) => {
      const lines = section
        .trim()
        .split("\n")
        .filter((line) => line.trim())
      const title = lines[0]?.trim().toLowerCase()
      const content = lines.slice(1).join("\n").trim()

      if (title.includes("原因分析")) {
        analysis = content
      } else if (title.includes("分龄建议")) {
        suggestions = content.split("\n").filter((line) => line.trim())
      } else if (title.includes("可操作清单")) {
        actionItems = content.split("\n").filter((line) => line.trim())
      }
    })

    return {
      analysis: analysis || "正在分析中...",
      suggestions: suggestions.length > 0 ? suggestions : ["建议正在生成中..."],
      actionItems: actionItems.length > 0 ? actionItems : ["行动清单正在生成中..."],
    }
  } catch (error) {
    console.error("AI顾问服务错误:", error)
    throw new Error("AI顾问暂时不可用，请稍后再试")
  }
}
