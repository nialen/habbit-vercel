/**
 * AI顾问API测试脚本
 * 用于测试和调试OpenRouter API调用
 */

require("dotenv").config({ path: ".env.local" })

async function testAIAdvisor() {
  console.log("🤖 测试AI顾问API...")

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    console.error("❌ 缺少 OPENROUTER_API_KEY 环境变量")
    return
  }

  const testPrompt = "我的5岁孩子不愿意刷牙，有什么好的方法让他养成刷牙的习惯？"

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "儿童习惯养成平台",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content:
              "你是一个专业的儿童教育顾问，专门帮助家长培养孩子的良好习惯。请提供实用、温和且适合儿童年龄的建议。",
          },
          {
            role: "user",
            content: testPrompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    console.log("✅ API调用成功！")
    console.log("📝 问题:", testPrompt)
    console.log("💡 回答:", data.choices[0].message.content)
    console.log("📊 使用统计:", {
      prompt_tokens: data.usage?.prompt_tokens,
      completion_tokens: data.usage?.completion_tokens,
      total_tokens: data.usage?.total_tokens,
    })
  } catch (error) {
    console.error("❌ API调用失败:", error.message)
    if (error.response) {
      console.error("响应状态:", error.response.status)
      console.error("响应数据:", await error.response.text())
    }
  }
}

// 执行测试
testAIAdvisor().catch(console.error)
