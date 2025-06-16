#!/usr/bin/env node

/**
 * AI顾问API测试脚本
 * 用于测试和调试OpenRouter API调用
 */

require('dotenv').config({ path: '.env.local' })
const OpenAI = require('openai').default

async function testAIAdvisor() {
  console.log('🧪 开始测试AI顾问API...\n')

  // 检查环境变量
  const apiKey = process.env.HABIT_WORDS_KEY
  if (!apiKey) {
    console.error('❌ 错误: HABIT_WORDS_KEY 环境变量未设置')
    console.log('请在 .env.local 文件中设置 HABIT_WORDS_KEY=sk-or-v1-your-api-key')
    process.exit(1)
  }

  console.log(`✅ API密钥: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`)
  console.log(`📝 API密钥长度: ${apiKey.length} 字符\n`)

  // 初始化客户端
  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
  })

  // 测试简单的文本生成
  console.log('🔄 测试简单的文本生成...')
  
  try {
    const completion = await client.chat.completions.create({
      model: "google/gemini-2.5-pro-preview-06-05",
      messages: [
        {
          role: "user",
          content: "请简单回答：你好"
        }
      ],
      max_tokens: 100
    }, {
      headers: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://habitkids.online",
        "X-Title": "StarVoyage Habit Kids"
      }
    })

    const response = completion.choices[0]?.message?.content
    if (response) {
      console.log('✅ 测试成功!')
      console.log('📝 AI响应:', response)
    } else {
      console.log('⚠️  警告: 收到空响应')
    }

  } catch (error) {
    console.error('❌ API调用失败:')
    console.error('错误类型:', error.constructor.name)
    console.error('错误消息:', error.message)
    
    if (error.response) {
      console.error('HTTP状态码:', error.response.status)
      console.error('响应数据:', error.response.data)
    }
    
    if (error.code) {
      console.error('错误代码:', error.code)
    }
    
    process.exit(1)
  }

  console.log('\n🧪 测试完成!')
}

// 运行测试
testAIAdvisor().catch(console.error) 