const fs = require('fs');

function checkEnvironment() {
  console.log('🔍 环境配置检查');
  console.log('================');
  
  // 检查当前 NODE_ENV
  console.log(`NODE_ENV: ${process.env.NODE_ENV || '未设置'}`);
  console.log(`DATABASE_ENVIRONMENT: ${process.env.DATABASE_ENVIRONMENT || '未设置'}`);
  console.log('');
  
  // 检查环境文件
  const envFiles = ['.env.development', '.env.production', '.env.local'];
  
  console.log('📁 环境文件状态:');
  envFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`- ${file}: ${exists ? '✅ 存在' : '❌ 不存在'}`);
  });
  console.log('');
  
  // 如果存在 .env.development，检查其内容
  if (fs.existsSync('.env.development')) {
    console.log('📋 开发环境配置:');
    const content = fs.readFileSync('.env.development', 'utf8');
    
    const configs = [
      'NEXT_PUBLIC_APP_MODE',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];
    
    configs.forEach(config => {
      const match = content.match(new RegExp(`${config}=(.+)`));
      if (match) {
        let value = match[1].trim();
        if (config.includes('KEY') && value.length > 20) {
          value = value.substring(0, 20) + '...';
        }
        console.log(`- ${config}: ${value}`);
      } else {
        console.log(`- ${config}: ❌ 未配置`);
      }
    });
  }
  
  console.log('');
  console.log('🚀 启动命令:');
  console.log('- 开发环境: npm run dev');
  console.log('- 配置 Supabase: npm run configure-supabase <PROJECT_ID> [ANON_KEY]');
}

checkEnvironment(); 