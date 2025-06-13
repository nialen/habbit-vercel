#!/usr/bin/env node

/**
 * 完整AI顾问功能测试脚本
 * 测试育儿建议的完整功能
 */

require('dotenv').config({ path: '.env.local' })

// 导入我们的函数
async function testFullAdvisor() {
  console.log('🧪 测试完整的AI顾问功能...\n')

  try {
    // 动态导入ES模块
    const { getParentingAdvice } = await import('../lib/openai.ts')
    
    console.log('🔄 测试育儿建议功能...')
    
    const result = await getParentingAdvice("孩子不愿意刷牙怎么办？", 5)
    
    console.log('✅ 测试成功!')
    console.log('\n📝 AI建议结果:')
    console.log('分析:', result.analysis)
    console.log('\n建议:')
    result.suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion}`)
    })
    console.log('\n行动清单:')
    result.actionItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item}`)
    })

  } catch (error) {
    console.error('❌ 测试失败:')
    console.error('错误类型:', error.constructor.name)
    console.error('错误消息:', error.message)
    
    if (error.stack) {
      console.error('堆栈跟踪:', error.stack)
    }
    
    process.exit(1)
  }

  console.log('\n🧪 完整功能测试完成!')
}

// 运行测试
testFullAdvisor().catch(console.error) 