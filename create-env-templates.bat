@echo off
REM 创建环境配置模板 (Windows版)

echo 📁 创建开发环境配置模板...

(
echo # Development Environment Configuration
echo # 开发环境配置 - 使用测试数据库
echo # 复制此文件为 .env.development 并填入实际值
echo.
echo # 环境标识
echo NODE_ENV=development
echo NEXT_PUBLIC_APP_ENV=development
echo.
echo # 应用配置
echo NEXT_PUBLIC_APP_URL=http://localhost:3000
echo NEXT_PUBLIC_APP_NAME=星航成长营 StarVoyage ^(开发^)
echo.
echo # Supabase开发环境配置
echo NEXT_PUBLIC_SUPABASE_URL=your_dev_supabase_project_url
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your_dev_supabase_anon_key
echo SUPABASE_SERVICE_ROLE_KEY=your_dev_supabase_service_role_key
echo.
echo # Plausible Analytics - 开发环境
echo NEXT_PUBLIC_PLAUSIBLE_DOMAIN=dev.habitkids.online
echo NEXT_PUBLIC_ENABLE_ANALYTICS=false
echo.
echo # 调试配置
echo NEXT_PUBLIC_ENABLE_DEBUG=true
echo NEXT_PUBLIC_ENABLE_CONSOLE_LOGS=true
echo.
echo # API配置
echo NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
echo.
echo # OpenAI API
echo OPENAI_API_KEY=your_dev_openai_api_key
echo.
echo # Replicate API
echo REPLICATE_API_TOKEN=your_dev_replicate_api_token
echo.
echo # 数据库配置
echo DATABASE_ENVIRONMENT=development
) > .env.development.example

echo 📁 创建生产环境配置模板...

(
echo # Production Environment Configuration
echo # 生产环境配置 - 使用正式数据库
echo # 复制此文件为 .env.production 并填入实际值
echo.
echo # 环境标识
echo NODE_ENV=production
echo NEXT_PUBLIC_APP_ENV=production
echo.
echo # 应用配置
echo NEXT_PUBLIC_APP_URL=https://habitkids.online
echo NEXT_PUBLIC_APP_NAME=星航成长营 StarVoyage
echo.
echo # Supabase生产环境配置
echo NEXT_PUBLIC_SUPABASE_URL=your_prod_supabase_project_url
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your_prod_supabase_anon_key
echo SUPABASE_SERVICE_ROLE_KEY=your_prod_supabase_service_role_key
echo.
echo # Plausible Analytics - 生产环境
echo NEXT_PUBLIC_PLAUSIBLE_DOMAIN=habitkids.online
echo NEXT_PUBLIC_ENABLE_ANALYTICS=true
echo.
echo # 调试配置
echo NEXT_PUBLIC_ENABLE_DEBUG=false
echo NEXT_PUBLIC_ENABLE_CONSOLE_LOGS=false
echo.
echo # API配置
echo NEXT_PUBLIC_API_BASE_URL=https://habitkids.online/api
echo.
echo # OpenAI API
echo OPENAI_API_KEY=your_prod_openai_api_key
echo.
echo # Replicate API
echo REPLICATE_API_TOKEN=your_prod_replicate_api_token
echo.
echo # 数据库配置
echo DATABASE_ENVIRONMENT=production
) > .env.production.example

echo ✅ 环境配置模板文件已创建完成！
echo.
echo 📝 请复制并编辑这些文件：
echo - copy .env.development.example .env.development
echo - copy .env.production.example .env.production 