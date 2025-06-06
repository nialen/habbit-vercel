// Supabase 配置诊断脚本
console.log('🔍 检查 Supabase 配置...\n')

// 读取环境变量
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('📋 当前配置:')
console.log('URL:', url)
console.log('Anon Key 长度:', anonKey ? anonKey.length : '未设置')
console.log('Anon Key 前20字符:', anonKey ? anonKey.substring(0, 20) + '...' : '未设置')

// 检查格式
if (!url) {
  console.log('❌ Supabase URL 未设置')
} else if (!url.includes('supabase.co')) {
  console.log('❌ Supabase URL 格式不正确')
} else {
  console.log('✅ Supabase URL 格式正确')
}

if (!anonKey) {
  console.log('❌ Anon Key 未设置')
} else if (anonKey.length < 100) {
  console.log('❌ Anon Key 长度不足，可能不完整')
} else if (!anonKey.startsWith('eyJ')) {
  console.log('❌ Anon Key 格式不正确 (应该以 eyJ 开头)')
} else {
  console.log('✅ Anon Key 格式看起来正确')
}

console.log('\n📖 如何获取正确配置:')
console.log('1. 访问: https://supabase.com/dashboard')
console.log('2. 选择项目: amrandqdoxddhajwliqw')  
console.log('3. 进入: Settings → API')
console.log('4. 复制: Project URL 和 anon/public key')

// 尝试简单连接测试
if (url && anonKey) {
  console.log('\n🧪 尝试连接测试...')
  
  fetch(`${url}/rest/v1/`, {
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`
    }
  })
  .then(response => {
    if (response.ok) {
      console.log('✅ Supabase 连接测试成功')
    } else {
      console.log('❌ Supabase 连接失败:', response.status, response.statusText)
    }
  })
  .catch(error => {
    console.log('❌ 连接测试出错:', error.message)
  })
} 