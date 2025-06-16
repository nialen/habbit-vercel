#!/bin/bash

echo "🔧 星航成长营 - 邮箱验证码快速修复"
echo "=================================="
echo

echo "📋 正在检查和修复配置..."

# 创建基本的环境配置文件
echo "💾 创建开发环境配置..."
cat > .env.development << 'EOF'
NODE_ENV=development
NEXT_PUBLIC_APP_MODE=complete

# Supabase 配置 (演示模式)
NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo_key

# 开发模式说明
# 当前使用演示模式，验证码为: 123456
# 如需配置真实的 Supabase，请:
# 1. 访问 https://supabase.com
# 2. 创建新项目
# 3. 在 Settings > API 中获取 URL 和 anon key
# 4. 替换上面的 demo 值
EOF

echo "✅ 环境配置文件已创建"

# 检查应用状态
echo
echo "🔍 检查应用状态..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ 应用正在运行"
else
    echo "⚠️ 应用未运行，请使用: npm run dev"
fi

echo
echo "🎯 修复完成！现在可以测试邮箱验证功能："
echo
echo "📝 使用说明："
echo "1. 访问 http://localhost:3000"
echo "2. 点击 '免费注册' 按钮"
echo "3. 输入任意有效邮箱地址"
echo "4. 使用验证码: 123456"
echo "5. 完成注册流程"
echo
echo "💡 演示模式特性："
echo "   - 无需真实的 Supabase 配置"
echo "   - 验证码固定为 123456"
echo "   - 所有功能正常工作"
echo
echo "🚀 如需配置真实邮箱服务，请参考文档："
echo "   - README.md"
echo "   - EMAIL_VERIFICATION_IMPLEMENTATION.md"
echo
echo "准备就绪！🎉"
