import OpenAI from "openai"

// AI顾问响应接口
export interface AdvisorResponse {
  analysis: string
  suggestions: string[]
  actionItems: string[]
}

// 初始化OpenAI客户端（仅在服务端使用）
function createOpenAIClient() {
  const apiKey = process.env.HABIT_WORDS_KEY
  if (!apiKey) {
    throw new Error("HABIT_WORDS_KEY environment variable is not set")
  }

  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
  })
}

// 获取育儿建议（服务端函数）
export async function getParentingAdvice(concern: string, childAge: number): Promise<AdvisorResponse> {
  try {
    const client = createOpenAIClient()
    
    const prompt = `你是一位专业的儿童教育专家和育儿顾问。请针对以下情况提供专业建议：

孩子年龄：${childAge}岁
家长困惑：${concern}

请按照以下格式回答，用JSON格式返回：
{
  "analysis": "深入分析这个年龄段孩子的心理特点和行为原因（150字以内）",
  "suggestions": ["建议1", "建议2", "建议3", "建议4", "建议5"],
  "actionItems": ["具体行动1", "具体行动2", "具体行动3", "具体行动4", "具体行动5"]
}

要求：
1. 分析要基于儿童发展心理学
2. 建议要实用且易于执行
3. 行动项要具体明确，可立即实施
4. 语言要温和、积极、富有同理心
5. 必须返回有效的JSON格式`

    const completion = await client.chat.completions.create({
      model: "google/gemini-2.5-pro-preview",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    }, {
      headers: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://habitkids.online",
        "X-Title": "星航成长营 StarVoyage"
      }
    })

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error("No response from AI")
    }

    // 尝试解析JSON响应
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const response = JSON.parse(jsonMatch[0])
        return {
          analysis: response.analysis || "AI正在分析您的问题...",
          suggestions: Array.isArray(response.suggestions) ? response.suggestions : ["请稍后再试"],
          actionItems: Array.isArray(response.actionItems) ? response.actionItems : ["请联系技术支持"]
        }
      }
    } catch (parseError) {
      console.error("JSON解析错误:", parseError)
    }

    // 如果JSON解析失败，返回基础响应
    return {
      analysis: "感谢您的咨询，这是一个很常见但重要的育儿问题。每个孩子都有自己的特点和成长节奏。",
      suggestions: [
        "保持耐心和一致性",
        "观察孩子的具体需求和反应",
        "创造积极的环境氛围",
        "适当给予鼓励和奖励",
        "如有必要寻求专业建议"
      ],
      actionItems: [
        "今天就开始实施一个小改变",
        "记录孩子的行为模式",
        "与孩子进行开放的沟通",
        "制定适合的日常规律",
        "保持积极的家庭氛围"
      ]
    }

  } catch (error) {
    console.error("AI顾问API错误:", error)
    console.error("错误详情:", {
      message: error instanceof Error ? error.message : '未知错误',
      name: error instanceof Error ? error.name : '未知错误类型',
      stack: error instanceof Error ? error.stack : '无堆栈信息',
      hasApiKey: !!process.env.HABIT_WORDS_KEY,
      apiKeyLength: process.env.HABIT_WORDS_KEY?.length || 0
    })
    
    // 返回友好的错误响应
    return {
      analysis: "很抱歉，AI顾问暂时无法处理您的请求。但请不要担心，育儿路上遇到困惑是很正常的。",
      suggestions: [
        "尝试与其他有经验的家长交流",
        "查阅相关的育儿书籍或资料",
        "观察孩子的行为模式，寻找规律",
        "保持耐心，给孩子和自己时间",
        "必要时咨询专业的儿童心理医生"
      ],
      actionItems: [
        "记录具体的问题情况和时间",
        "尝试一种新的沟通方式",
        "创造更多亲子互动时间",
        "建立稳定的日常作息",
        "寻求家人或朋友的支持"
      ]
    }
  }
}
