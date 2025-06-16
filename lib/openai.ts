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
    
    const prompt = `你是一位拥有20年经验的国际认证儿童心理学专家和发展心理学博士，专精于${childAge}岁儿童的认知、情感和行为发展。

【案例信息】
- 孩子年龄：${childAge}岁
- 家长困惑：${concern}

请基于儿童发展心理学理论（如皮亚杰认知发展理论、艾里克森心理社会发展理论、依恋理论等），为这位家长提供专业、详细的指导建议。

【${childAge}岁儿童发展特点】
请首先分析这个年龄段孩子的：
- 认知发展水平和特点
- 情感需求和表达方式
- 社交能力和行为模式
- 常见挑战和敏感期

请按照以下JSON格式提供详细分析：

{
  "analysis": "作为儿童心理学专家，我需要从${childAge}岁孩子的发展特点来分析这个问题。在这个年龄段，孩子正处于[具体发展阶段]...[请提供300-400字的深入分析，包含发展心理学理论依据、行为背后的心理原因、以及这种行为在该年龄段的正常性或需要关注的地方]",
  "suggestions": [
    "【发展适宜性策略】基于${childAge}岁孩子的认知水平，建议...[详细说明为什么这个方法适合这个年龄]",
    "【情感支持技巧】针对这个年龄段的情感需求，家长可以...[具体的情感回应和支持方法]",
    "【行为引导方法】考虑到${childAge}岁孩子的行为特点，推荐使用...[科学的行为管理策略]",
    "【环境调整建议】为${childAge}岁孩子创造有利的成长环境...[具体的环境优化措施]",
    "【长期发展规划】从发展的角度看，这个问题需要...[长期的培养目标和方向]",
    "【家长心态调整】理解${childAge}岁孩子的发展规律，家长需要...[家长自身的心态和期望调整]"
  ],
  "actionItems": [
    "【立即行动】今天开始：观察并记录孩子在[具体情境]下的行为表现，持续3-5天",
    "【沟通技巧】用${childAge}岁孩子能理解的方式：[具体的对话示例和沟通策略]",
    "【日常调整】在每天的[具体时间/情境]，实施[具体行为策略]",
    "【正向强化】设计适合${childAge}岁孩子的奖励系统：[具体的激励方案]",
    "【专业评估】如果1-2周内没有改善，建议咨询[具体的专业资源]",
    "【家庭配合】与其他家庭成员（配偶/老人）统一[具体的教育方式和标准]",
    "【进度追踪】建立简单的记录表格，每周评估[具体的观察指标]"
  ]
}

【要求】
1. 所有建议必须基于${childAge}岁儿童的实际发展水平
2. 引用具体的儿童发展心理学理论和研究
3. 提供可操作的具体步骤，而非泛泛而谈
4. 考虑中国文化背景和家庭教育特点
5. 语言专业但易懂，体现专家权威性
6. 必须返回严格的JSON格式`

    const completion = await client.chat.completions.create({
      model: "google/gemini-2.5-pro-preview-06-05",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 3000
    }, {
      headers: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://habitkids.online",
        "X-Title": "StarVoyage Habit Kids"
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
