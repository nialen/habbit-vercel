/**
 * 完整AI顾问功能测试脚本
 * 测试多种场景和功能
 */

require("dotenv").config({ path: ".env.local" })

const testScenarios = [
  {
    name: "刷牙习惯",
    prompt: "我的5岁孩子不愿意刷牙，有什么好的方法让他养成刷牙的习惯？",
    category: "日常习惯",
  },
  {
    name: "作业拖延",
    prompt: "我的8岁孩子总是拖延写作业，如何帮助他建立良好的学习习惯？",
    category: "学习习惯",
  },
  {
    name: "睡前准备",
    prompt: "我的6岁女儿每天晚上都不愿意按时睡觉，如何建立良好的睡前习惯？",
    category: "生活习惯",
  },
]

async function callAIAdvisor(prompt, category) {
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
          content: `你是一个专业的儿童教育顾问，专门帮助家长培养孩子的良好习惯。
          
          请根据以下要求提供建议：
          1. 建议要实用且容易执行
          2. 考虑儿童的年龄特点
          3. 提供具体的步骤和方法
          4. 语言要温和、正面
          5. 如果可能，提供一些游戏化的方法
          
          当前咨询类别：${category}`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 600,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

async function testFullAdvisor() {
  console.log("🚀 开始完整AI顾问功能测试...\n")

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    console.error("❌ 缺少 OPENROUTER_API_KEY 环境变量")
    return
  }

  for (let i = 0; i < testScenarios.length; i++) {
    const scenario = testScenarios[i]
    console.log(`📋 测试场景 ${i + 1}: ${scenario.name}`)
    console.log(`📂 类别: ${scenario.category}`)
    console.log(`❓ 问题: ${scenario.prompt}\n`)

    try {
      const startTime = Date.now()
      const result = await callAIAdvisor(scenario.prompt, scenario.category)
      const endTime = Date.now()

      console.log("✅ 调用成功！")
      console.log(`⏱️  响应时间: ${endTime - startTime}ms`)
      console.log("💡 AI建议:")
      console.log(result.choices[0].message.content)
      console.log("\n📊 使用统计:")
      console.log(`- Prompt tokens: ${result.usage?.prompt_tokens}`)
      console.log(`- Completion tokens: ${result.usage?.completion_tokens}`)
      console.log(`- Total tokens: ${result.usage?.total_tokens}`)
    } catch (error) {
      console.error(`❌ 测试失败: ${error.message}`)
    }

    console.log("\n" + "=".repeat(80) + "\n")

    // 添加延迟避免API限制
    if (i < testScenarios.length - 1) {
      console.log("⏳ 等待2秒后继续下一个测试...\n")
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  console.log("🎉 所有测试完成！")
}

// 执行测试
testFullAdvisor().catch(console.error)
