// Supabase 连接测试脚本
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

console.log('=== Supabase 连接测试 ===');
console.log('URL:', SUPABASE_URL);
console.log('Anon Key:', SUPABASE_ANON_KEY ? `${SUPABASE_ANON_KEY.substring(0, 20)}...` : 'undefined');
console.log('Key Length:', SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.length : 0);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ 环境变量未正确配置');
  console.log('所有环境变量:', envVars);
  process.exit(1);
}

// 测试基础连接
async function testConnection() {
  try {
    console.log('\n测试 1: 基础 REST API 连接...');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('✅ REST API 连接成功');
    } else {
      console.log('❌ REST API 连接失败:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ REST API 连接错误:', error.message);
  }

  try {
    console.log('\n测试 2: Auth API 连接...');
    const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'testpassword'
      })
    });
    
    console.log('Auth API 响应状态:', authResponse.status);
    
    if (authResponse.status === 400) {
      const result = await authResponse.json();
      console.log('Auth API 响应:', result);
      if (result.msg && result.msg.includes('User already registered')) {
        console.log('✅ Auth API 连接成功 (用户已存在)');
      } else {
        console.log('✅ Auth API 连接成功');
      }
    } else if (authResponse.status === 200 || authResponse.status === 201) {
      console.log('✅ Auth API 连接成功');
    } else {
      const errorText = await authResponse.text();
      console.log('❌ Auth API 错误:', authResponse.status, errorText);
    }
  } catch (error) {
    console.log('❌ Auth API 连接错误:', error.message);
  }
}

testConnection(); 