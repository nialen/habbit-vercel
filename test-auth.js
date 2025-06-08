// 测试 AuthProvider 使用的 Supabase 配置
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

console.log('=== AuthProvider 配置检查 ===\n');

// 模拟 lib/supabase.ts 中的检查逻辑
const isValidSupabaseConfig = 
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL !== 'your_dev_supabase_project_url' && 
  SUPABASE_URL !== 'your_prod_supabase_project_url' &&
  SUPABASE_URL.startsWith('https://') &&
  SUPABASE_ANON_KEY !== 'your_dev_supabase_anon_key' &&
  SUPABASE_ANON_KEY !== 'your_prod_supabase_anon_key';

console.log('📋 配置检查结果:');
console.log('- SUPABASE_URL:', SUPABASE_URL);
console.log('- URL有效性:', !!SUPABASE_URL);
console.log('- URL不是占位符:', SUPABASE_URL !== 'your_dev_supabase_project_url');
console.log('- URL以https开头:', SUPABASE_URL ? SUPABASE_URL.startsWith('https://') : false);
console.log('- ANON_KEY有效性:', !!SUPABASE_ANON_KEY);
console.log('- KEY不是占位符:', SUPABASE_ANON_KEY !== 'your_dev_supabase_anon_key');
console.log('- 最终配置有效性:', isValidSupabaseConfig);

if (isValidSupabaseConfig) {
  console.log('\n✅ Supabase 配置有效，AuthProvider 应该正常工作');
} else {
  console.log('\n❌ Supabase 配置无效，这就是为什么 AuthProvider 不工作');
}
