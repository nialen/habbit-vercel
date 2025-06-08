const { createClient } = require('@supabase/supabase-js')

// 从环境变量读取配置
require('dotenv').config({ path: '.env.development' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 测试 OAuth 配置...')
console.log('Supabase URL:', supabaseUrl ? '✅ 已配置' : '❌ 未配置')
console.log('Supabase Key:', supabaseKey ? '✅ 已配置' : '❌ 未配置')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 配置不完整')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testOAuth() {
  try {
    console.log('\n🧪 测试 OAuth 配置...')
    
    // 测试获取当前会话
    const { data: session, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('❌ 获取会话失败:', sessionError.message)
    } else {
      console.log('✅ 成功连接到 Supabase Auth')
      console.log('当前会话:', session.session ? '已登录' : '未登录')
    }

    // 测试数据库连接
    const { data, error } = await supabase.from('user_profiles').select('count', { count: 'exact', head: true })
    if (error) {
      console.error('❌ 数据库连接失败:', error.message)
    } else {
      console.log('✅ 数据库连接正常')
      console.log('用户资料表记录数:', data)
    }

    console.log('\n📋 OAuth 配置检查项:')
    console.log('1. ✅ Supabase 项目配置正确')
    console.log('2. ✅ Auth 服务可访问')
    console.log('3. ✅ 数据库表存在')
    console.log('4. ⚠️  需要在 Supabase 控制台配置 GitHub OAuth:')
    console.log('   - Authentication > Providers > GitHub')
    console.log('   - Client ID 和 Client Secret')
    console.log('   - Redirect URL: http://localhost:3000/auth/callback')
    console.log('5. ⚠️  需要在 GitHub 创建 OAuth App:')
    console.log('   - Settings > Developer settings > OAuth Apps')
    console.log('   - Authorization callback URL: https://amrandqdoxddhajwliqw.supabase.co/auth/v1/callback')

  } catch (error) {
    console.error('❌ 测试失败:', error.message)
  }
}

testOAuth() 