@echo off
REM 环境设置脚本 (Windows版)
REM Environment setup script for StarVoyage project (Windows)

setlocal enabledelayedexpansion

set ENV_TYPE=%1
if "%ENV_TYPE%"=="" set ENV_TYPE=development

echo 🚀 星航成长营 StarVoyage - 环境配置设置
echo =======================================
echo 设置环境: %ENV_TYPE%
echo.

REM 检查环境类型
if not "%ENV_TYPE%"=="development" if not "%ENV_TYPE%"=="production" (
    echo ❌ 错误: 环境类型必须是 'development' 或 'production'
    echo 用法: %0 [development^|production]
    exit /b 1
)

REM 设置环境文件路径
set ENV_FILE=.env.%ENV_TYPE%
set ENV_EXAMPLE=.env.%ENV_TYPE%.example

REM 检查模板文件是否存在
if not exist "%ENV_EXAMPLE%" (
    echo ❌ 错误: 模板文件 %ENV_EXAMPLE% 不存在
    echo 请先运行: npm run create-env-templates
    exit /b 1
)

REM 如果环境文件已存在，提示用户
if exist "%ENV_FILE%" (
    echo ⚠️  环境文件 %ENV_FILE% 已存在
    set /p confirm="是否要覆盖现有文件? (y/N): "
    if /i not "!confirm!"=="y" (
        echo ❌ 操作取消
        exit /b 0
    )
)

REM 复制模板文件
echo 📁 复制环境配置模板...
copy "%ENV_EXAMPLE%" "%ENV_FILE%" >nul

echo ✅ 环境文件 %ENV_FILE% 已创建
echo.

REM 提示用户编辑配置
echo 📝 下一步操作:
echo 1. 编辑 %ENV_FILE% 文件
echo 2. 填入正确的配置值:
if "%ENV_TYPE%"=="development" (
    echo    - 开发环境 Supabase 配置
    echo    - 测试数据库连接信息
    echo    - 开发环境 API 密钥
) else (
    echo    - 生产环境 Supabase 配置
    echo    - 正式数据库连接信息
    echo    - 生产环境 API 密钥
)
echo 3. 运行: npm run dev ^(开发环境^) 或 npm run build:prod ^(生产环境^)
echo.

REM 显示配置检查命令
echo 🔍 配置验证:
echo npm run check-env
echo.

echo 🎉 环境配置设置完成！
