#!/bin/bash

# 环境设置脚本
# Environment setup script for StarVoyage project

set -e

ENV_TYPE=${1:-development}

echo "🚀 星航成长营 StarVoyage - 环境配置设置"
echo "======================================="
echo "设置环境: $ENV_TYPE"
echo ""

# 检查环境类型
if [[ "$ENV_TYPE" != "development" && "$ENV_TYPE" != "production" ]]; then
    echo "❌ 错误: 环境类型必须是 'development' 或 'production'"
    echo "用法: $0 [development|production]"
    exit 1
fi

# 设置环境文件路径
ENV_FILE=".env.$ENV_TYPE"
ENV_EXAMPLE=".env.$ENV_TYPE.example"

# 检查模板文件是否存在
if [[ ! -f "$ENV_EXAMPLE" ]]; then
    echo "❌ 错误: 模板文件 $ENV_EXAMPLE 不存在"
    echo "请先运行: npm run create-env-templates"
    exit 1
fi

# 如果环境文件已存在，提示用户
if [[ -f "$ENV_FILE" ]]; then
    echo "⚠️  环境文件 $ENV_FILE 已存在"
    read -p "是否要覆盖现有文件? (y/N): " confirm
    if [[ ! "$confirm" =~ ^[yY]$ ]]; then
        echo "❌ 操作取消"
        exit 0
    fi
fi

# 复制模板文件
echo "📁 复制环境配置模板..."
cp "$ENV_EXAMPLE" "$ENV_FILE"

echo "✅ 环境文件 $ENV_FILE 已创建"
echo ""

# 提示用户编辑配置
echo "📝 下一步操作:"
echo "1. 编辑 $ENV_FILE 文件"
echo "2. 填入正确的配置值:"
if [[ "$ENV_TYPE" == "development" ]]; then
    echo "   - 开发环境 Supabase 配置"
    echo "   - 测试数据库连接信息"
    echo "   - 开发环境 API 密钥"
else
    echo "   - 生产环境 Supabase 配置"
    echo "   - 正式数据库连接信息"
    echo "   - 生产环境 API 密钥"
fi
echo "3. 运行: npm run dev (开发环境) 或 npm run build:prod (生产环境)"
echo ""

# 显示配置检查命令
echo "🔍 配置验证:"
echo "npm run check-env"
echo ""

echo "🎉 环境配置设置完成！"
