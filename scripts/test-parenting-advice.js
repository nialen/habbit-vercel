/**
 * 育儿建议API测试脚本
 * 专门测试育儿相关的AI建议功能
 */

require("dotenv").config({ path: ".env.local" })

const parentingScenarios = [
  {
    name: "奖励机制",
    prompt: "如何设计一个有效的奖励机制来鼓励孩子完成日常任务？",
    expectedKeywords: ["奖励", "激励", "任务", "完成"],
  },
  {
    name: "习惯养成",
    prompt: "孩子总是忘记做家务，如何帮助他们建立责任感？",
    expectedKeywords: ["家务", "责任感", "提醒", "习惯"],
  },
  {
    name: "时间管理",
    prompt: "如何教7岁的孩子管理时间，平衡学习和玩耍？",
    expectedKeywords: ["时间管理", "平衡", "学习", "玩耍"],
  },
  {
    name: "情绪管理",
    prompt: "孩子在遇到挫折时容易发脾气，如何帮助他们管理情绪？",
    expectedKeywords: ["情绪", "挫折", "发脾气", "管理"],
  },
]

async function testParentingAdvice(scenario) {
  const apiKey = process.env.OPENROUTER_API_KEY

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
          content: `你是一个经验丰富的儿童心理学家和教育专家，专门为家长提供科学、实用的育儿建议。

          请遵循以下原则：
          1. 基于儿童发展心理学理论
          2. 提供具体可操作的方法
          3. 考虑不同年龄段的特点
          4. 强调正面教育和鼓励
          5. 避免惩罚性措施
          6. 提供循序渐进的实施步骤
          
          请用温和、专业且易懂的语言回答。`,
        },
        {
          role: "user",
          content: scenario.prompt,
        },
      ],
      max_tokens: 800,
      temperature: 0.6,
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

function analyzeResponse(response, expectedKeywords) {
  const content = response.choices[0].message.content.toLowerCase()
  const foundKeywords = expectedKeywords.filter((keyword) => content.includes(keyword.toLowerCase()))

  return {
    relevanceScore: (foundKeywords.length / expectedKeywords.length) * 100,
    foundKeywords,
    missedKeywords: expectedKeywords.filter((keyword) => !content.includes(keyword.toLowerCase())),
    wordCount: content.split(" ").length,
    hasActionableAdvice: content.includes("步骤") || content.includes("方法") || content.includes("建议"),
  }
}

async function runParentingTests() {
  console.log("👨‍👩‍👧‍👦 开始育儿建议API测试...\n")

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    console.error("❌ 缺少 OPENROUTER_API_KEY 环境变量")
    return
  }

  const results = []

  for (let i = 0; i < parentingScenarios.length; i++) {
    const scenario = parentingScenarios[i]
    console.log(`🧪 测试 ${i + 1}/${parentingScenarios.length}: ${scenario.name}`)
    console.log(`❓ 问题: ${scenario.prompt}\n`)

    try {
      const startTime = Date.now()
      const response = await testParentingAdvice(scenario)
      const endTime = Date.now()

      const analysis = analyzeResponse(response, scenario.expectedKeywords)

      console.log("✅ 测试成功！")
      console.log(`⏱️  响应时间: ${endTime - startTime}ms`)
      console.log(`📊 相关性评分: ${analysis.relevanceScore.toFixed(1)}%`)
      console.log(`🎯 找到关键词: ${analysis.foundKeywords.join(", ")}`)
      if (analysis.missedKeywords.length > 0) {
        console.log(`❌ 遗漏关键词: ${analysis.missedKeywords.join(", ")}`)
      }
      console.log(`📝 字数: ${analysis.wordCount}`)
      console.log(`💡 包含可执行建议: ${analysis.hasActionableAdvice ? "是" : "否"}`)

      console.log("\n🤖 AI回答:")
      console.log(response.choices[0].message.content)

      results.push({
        scenario: scenario.name,
        success: true,
        responseTime: endTime - startTime,
        analysis,
      })
    } catch (error) {
      console.error(`❌ 测试失败: ${error.message}`)
      results.push({
        scenario: scenario.name,
        success: false,
        error: error.message,
      })
    }

    console.log("\n" + "=".repeat(80) + "\n")

    // 添加延迟
    if (i < parentingScenarios.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }
  }

  // 输出总结
  console.log("📈 测试总结:")
  const successCount = results.filter((r) => r.success).length
  console.log(`✅ 成功: ${successCount}/${results.length}`)

  if (successCount > 0) {
    const avgResponseTime = results.filter((r) => r.success).reduce((sum, r) => sum + r.responseTime, 0) / successCount

    const avgRelevance =
      results.filter((r) => r.success).reduce((sum, r) => sum + r.analysis.relevanceScore, 0) / successCount

    console.log(`⏱️  平均响应时间: ${avgResponseTime.toFixed(0)}ms`)
    console.log(`🎯 平均相关性: ${avgRelevance.toFixed(1)}%`)
  }

  console.log("\n🎉 育儿建议测试完成！")
}

// 执行测试
runParentingTests().catch(console.error)
