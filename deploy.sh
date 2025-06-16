#!/bin/bash

# 星航成长营 - 快速部署脚本
# 使用方法: ./deploy.sh "提交信息"

set -e

# 检查是否提供了提交信息
if [ -z "$1" ]; then
    echo "❌ 请提供提交信息"
    echo "使用方法: ./deploy.sh \"你的提交信息\""
    exit 1
fi

COMMIT_MESSAGE="$1"

echo "🚀 开始部署星航成长营..."

# 检查当前是否在main分支
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "⚠️  当前不在主分支 ($CURRENT_BRANCH)"
    read -p "是否要切换到main分支? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout main
    else
        echo "❌ 取消部署"
        exit 1
    fi
fi

# 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main

# 检查是否有本地更改
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 发现本地更改，准备提交..."
    
    # 添加所有更改
    git add .
    
    # 显示将要提交的文件
    echo "📋 将要提交的文件:"
    git status --short
    
    # 确认提交
    read -p "确认提交这些更改? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # 提交更改
        git commit -m "$COMMIT_MESSAGE"
        echo "✅ 代码已提交"
    else
        echo "❌ 取消提交"
        exit 1
    fi
else
    echo "ℹ️  没有本地更改需要提交"
fi

# 推送到远程仓库
echo "🔄 推送代码到GitHub..."
git push origin main

echo "🎉 代码已推送！Vercel将自动开始部署..."
echo "📊 你可以在以下位置查看部署状态:"
echo "   - Vercel Dashboard: https://vercel.com/dashboard"
echo "   - GitHub Actions: https://github.com/你的用户名/你的仓库名/actions"

# 可选：打开浏览器查看部署状态
read -p "是否要打开Vercel Dashboard? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # 根据操作系统打开浏览器
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open https://vercel.com/dashboard
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open https://vercel.com/dashboard
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        start https://vercel.com/dashboard
    fi
fi

echo "✨ 部署完成！"
