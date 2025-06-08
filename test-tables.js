// 测试数据库表是否存在
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

async function testTables() {
  console.log('=== 测试数据库表结构 ===\n');
  
  const tables = ['user_profiles', 'posts', 'comments', 'habits', 'habit_logs'];
  
  for (const table of tables) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?limit=1`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log(`✅ ${table} 表存在且可访问`);
      } else {
        const errorText = await response.text();
        console.log(`❌ ${table} 表问题:`, response.status, errorText);
      }
    } catch (error) {
      console.log(`❌ ${table} 表错误:`, error.message);
    }
  }
}

testTables();
