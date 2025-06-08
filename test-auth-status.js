// 测试当前的认证状态
const fs = require('fs');

// 读取环境文件
const envFile = fs.readFileSync('.env.development', 'utf8');
const envVars = {};

envFile.split('\n').forEach(line => {
  if (line.includes('=') && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const SUPABASE_URL = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const SUPABASE_ANON_KEY = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const APP_MODE = envVars['NEXT_PUBLIC_APP_MODE'];

console.log('=== 当前认证状态检查 ===\n');
console.log('📋 应用配置:');
console.log('- 应用模式:', APP_MODE);
console.log('- Supabase URL:', SUPABASE_URL);
console.log('');

async function checkAuthStatus() {
  try {
    // 尝试获取当前用户
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('🔐 认证状态检查:');
    console.log('- 响应状态:', response.status);
    
    if (response.status === 200) {
      const user = await response.json();
      console.log('✅ 找到登录用户:', user?.email || '未知邮箱');
    } else if (response.status === 401) {
      console.log('❌ 用户未登录 (这就是为什么跳转到 /auth 页面)');
    } else {
      console.log('⚠️ 其他状态:', await response.text());
    }
  } catch (error) {
    console.log('❌ 检查错误:', error.message);
  }
}

console.log('当前的行为是否正确?');
if (APP_MODE === 'complete') {
  console.log('✅ 完整模式下，未登录用户应该被重定向到 /auth 页面');
  console.log('✅ 这是预期行为，不是错误！');
} else {
  console.log('✅ 演示模式下，应该自动登录显示 welcome screen');
}

console.log('');
checkAuthStatus();
