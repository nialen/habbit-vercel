#!/bin/bash
echo "🚀 星航成长营 - 邮箱验证码功能测试"
echo "=================================="
echo
echo "📋 检查应用状态..."

# 检查应用是否运行
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ 应用正在运行 (http://localhost:3000)"
else
    echo "❌ 应用未运行，请先启动: npm run dev"
    exit 1
fi

echo
echo "🧪 测试步骤："
echo "1. 在浏览器中访问: http://localhost:3000"
echo "2. 点击 \"免费注册\" 按钮"
echo "3. 测试邮箱验证码注册流程"
echo
echo "📖 测试页面："
echo "  file://$PWD/test-email-verification.html"
echo
echo "📚 功能文档："
echo "  $PWD/EMAIL_VERIFICATION_IMPLEMENTATION.md"
echo
echo "✨ 功能特性："
echo "  - 📧 邮箱格式验证"
echo "  - 🔢 6位验证码发送"
echo "  - ⏱️ 60秒倒计时防重复"
echo "  - 🛡️ 验证码安全验证"
echo "  - 👤 完整个人信息收集"
echo "  - 🎉 注册成功确认"
echo
echo "准备就绪！现在可以测试邮箱验证码注册功能了 🎯" 