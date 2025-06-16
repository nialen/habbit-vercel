@echo off
chcp 65001 >nul
setlocal

REM 星航成长营 - Windows快速部署脚本
REM 使用方法: deploy.bat "提交信息"

if "%~1"=="" (
    echo ❌ 请提供提交信息
    echo 使用方法: deploy.bat "你的提交信息"
    pause
    exit /b 1
)

set COMMIT_MESSAGE=%~1

echo 🚀 开始部署星航成长营...

REM 检查当前分支
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
if not "%CURRENT_BRANCH%"=="main" if not "%CURRENT_BRANCH%"=="master" (
    echo ⚠️  当前不在主分支 ^(%CURRENT_BRANCH%^)
    set /p SWITCH="是否要切换到main分支? (y/N): "
    if /i "%SWITCH%"=="y" (
        git checkout main
    ) else (
        echo ❌ 取消部署
        pause
        exit /b 1
    )
)

REM 拉取最新代码
echo 📥 拉取最新代码...
git pull origin main

REM 检查是否有本地更改
git status --porcelain > temp_status.txt
set /p HAS_CHANGES=<temp_status.txt
del temp_status.txt

if not "%HAS_CHANGES%"=="" (
    echo 📝 发现本地更改，准备提交...
    
    REM 添加所有更改
    git add .
    
    REM 显示将要提交的文件
    echo 📋 将要提交的文件:
    git status --short
    
    REM 确认提交
    set /p CONFIRM="确认提交这些更改? (y/N): "
    if /i "%CONFIRM%"=="y" (
        REM 提交更改
        git commit -m "%COMMIT_MESSAGE%"
        echo ✅ 代码已提交
    ) else (
        echo ❌ 取消提交
        pause
        exit /b 1
    )
) else (
    echo ℹ️  没有本地更改需要提交
)

REM 推送到远程仓库
echo 🔄 推送代码到GitHub...
git push origin main

echo 🎉 代码已推送！Vercel将自动开始部署...
echo 📊 你可以在以下位置查看部署状态:
echo    - Vercel Dashboard: https://vercel.com/dashboard
echo    - GitHub Actions: https://github.com/你的用户名/你的仓库名/actions

REM 询问是否打开浏览器
set /p OPEN_BROWSER="是否要打开Vercel Dashboard? (y/N): "
if /i "%OPEN_BROWSER%"=="y" (
    start https://vercel.com/dashboard
)

echo ✨ 部署完成！
pause
