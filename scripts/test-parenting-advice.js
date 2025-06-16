#!/usr/bin/env node

/**
 * 育儿建议功能测试脚本
 * 测试AI顾问的完整功能
 */

require('dotenv').config({ path: '.env.local' })

async function testParentingAdvice() {
  console.log('🧪 测试育儿建议功能...\n')

  try {
    // 直接测试API端点
    const testCases = [
      { concern: "5岁孩子不愿意刷牙怎么办？", childAge: 5 },
      { concern: "3岁孩子总是发脾气", childAge: 3 },
      { concern: "7岁孩子不爱写作业", childAge: 7 }
    ]

    for (const testCase of testCases) {
      console.log(`\n🔄 测试案例: ${testCase.concern}`)
      console.log(`👶 孩子年龄: ${testCase.childAge}岁`)
      
      const response = await fetch('http://localhost:3000/api/advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('\n✅ 专家分析:')
        console.log(data.analysis.substring(0, 200) + '...')
        
        console.log('\n📝 建议数量:', data.suggestions.length)
        console.log('🎯 行动清单数量:', data.actionItems.length)
        
        if (data.suggestions.length > 0) {
          console.log('第一条建议:', data.suggestions[0].substring(0, 100) + '...')
        }
      } else {
        console.log('❌ API调用失败:', response.status)
        const error = await response.text()
        console.log('错误信息:', error)
      }
      
      // 稍等一下避免请求过快
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    console.log('\n🎉 测试完成!')

  } catch (error) {
    console.error('❌ 测试失败:', error.message)
  }
}

testParentingAdvice() 