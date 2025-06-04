const fs = require('fs');

function configureSupabase() {
  const projectId = process.argv[2];
  const anonKey = process.argv[3];
  
  if (!projectId) {
    console.error('❌ 请提供 Supabase 项目 ID');
    console.error('用法: node configure-supabase.js <PROJECT_ID> [ANON_KEY]');
    process.exit(1);
  }
  
  console.log('🔧 配置 Supabase 连接...');
  console.log(`项目 ID: ${projectId}`);
  
  const supabaseUrl = `https://${projectId}.supabase.co`;
  
  // 读取现有的 .env.development 文件
  let envContent = '';
  try {
    envContent = fs.readFileSync('.env.development', 'utf8');
  } catch (error) {
    console.error('❌ .env.development 文件不存在，请先运行: npm run setup-env:dev');
    process.exit(1);
  }
  
  // 更新配置
  let updatedContent = envContent;
  
  // 更新应用模式为完整模式
  updatedContent = updatedContent.replace(
    /NEXT_PUBLIC_APP_MODE=.*/,
    'NEXT_PUBLIC_APP_MODE=complete'
  );
  
  // 更新 Supabase URL
  updatedContent = updatedContent.replace(
    /NEXT_PUBLIC_SUPABASE_URL=.*/,
    `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`
  );
  
  // 更新 Supabase Anon Key（如果提供）
  if (anonKey) {
    updatedContent = updatedContent.replace(
      /NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`
    );
  }
  
  // 如果没有找到应用模式配置，添加它
  if (!updatedContent.includes('NEXT_PUBLIC_APP_MODE=')) {
    updatedContent = updatedContent.replace(
      /NEXT_PUBLIC_APP_ENV=development/,
      `NEXT_PUBLIC_APP_ENV=development\nNEXT_PUBLIC_APP_MODE=complete`
    );
  }
  
  // 写回文件
  fs.writeFileSync('.env.development', updatedContent, 'utf8');
  
  console.log('✅ Supabase 配置已更新');
  console.log('');
  console.log('📝 配置信息:');
  console.log(`- 应用模式: 完整模式 (真实数据库)`);
  console.log(`- Supabase URL: ${supabaseUrl}`);
  if (anonKey) {
    console.log(`- Anon Key: ${anonKey.substring(0, 20)}...`);
  } else {
    console.log('- Anon Key: 需要手动配置');
  }
  console.log('');
  console.log('🔍 下一步:');
  if (!anonKey) {
    console.log('1. 在 Supabase 项目设置中获取 Anon Key');
    console.log('2. 手动更新 .env.development 中的 NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  console.log('3. 重启开发服务器: npm run dev');
  console.log('4. 应用现在会要求登录认证');
}

configureSupabase(); 