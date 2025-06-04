const fs = require('fs');
const path = require('path');

// 开发环境配置模板
const developmentConfig = `# Development Environment Configuration
# 开发环境配置 - 使用测试数据库
# 复制此文件为 .env.development 并填入实际值

# 环境标识
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=星航成长营 StarVoyage (开发)

# Supabase开发环境配置
NEXT_PUBLIC_SUPABASE_URL=your_dev_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_dev_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_dev_supabase_service_role_key

# Plausible Analytics - 开发环境
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=dev.habitkids.online
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# 调试配置
NEXT_PUBLIC_ENABLE_DEBUG=true
NEXT_PUBLIC_ENABLE_CONSOLE_LOGS=true

# API配置
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# OpenAI API
OPENAI_API_KEY=your_dev_openai_api_key

# Replicate API
REPLICATE_API_TOKEN=your_dev_replicate_api_token

# 数据库配置
DATABASE_ENVIRONMENT=development
`;

// 生产环境配置模板
const productionConfig = `# Production Environment Configuration
# 生产环境配置 - 使用正式数据库
# 复制此文件为 .env.production 并填入实际值

# 环境标识
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production

# 应用配置
NEXT_PUBLIC_APP_URL=https://habitkids.online
NEXT_PUBLIC_APP_NAME=星航成长营 StarVoyage

# Supabase生产环境配置
NEXT_PUBLIC_SUPABASE_URL=your_prod_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_prod_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_prod_supabase_service_role_key

# Plausible Analytics - 生产环境
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=habitkids.online
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# 调试配置
NEXT_PUBLIC_ENABLE_DEBUG=false
NEXT_PUBLIC_ENABLE_CONSOLE_LOGS=false

# API配置
NEXT_PUBLIC_API_BASE_URL=https://habitkids.online/api

# OpenAI API
OPENAI_API_KEY=your_prod_openai_api_key

# Replicate API
REPLICATE_API_TOKEN=your_prod_replicate_api_token

# 数据库配置
DATABASE_ENVIRONMENT=production
`;

function createEnvTemplates() {
  console.log('🚀 星航成长营 StarVoyage - 创建环境配置模板');
  console.log('===========================================');
  
  try {
    // 创建开发环境模板
    console.log('📁 创建开发环境配置模板...');
    fs.writeFileSync('.env.development.example', developmentConfig, 'utf8');
    
    // 创建生产环境模板
    console.log('📁 创建生产环境配置模板...');
    fs.writeFileSync('.env.production.example', productionConfig, 'utf8');
    
    console.log('✅ 环境配置模板文件已创建完成！');
    console.log('');
    console.log('📝 请复制并编辑这些文件：');
    console.log('- copy .env.development.example .env.development  (Windows)');
    console.log('- cp .env.development.example .env.development    (Unix/Mac)');
    console.log('- copy .env.production.example .env.production    (Windows)');
    console.log('- cp .env.production.example .env.production      (Unix/Mac)');
    console.log('');
    console.log('💡 或者使用npm脚本：');
    console.log('- npm run setup-env:dev   (设置开发环境)');
    console.log('- npm run setup-env:prod  (设置生产环境)');
    
  } catch (error) {
    console.error('❌ 创建环境配置模板时出错:', error.message);
    process.exit(1);
  }
}

createEnvTemplates(); 