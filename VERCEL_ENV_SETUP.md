# 🚀 Vercel环境变量配置指南

## ✅ 应用模式已设置为Complete

您的应用模式已成功设置为 **complete**！现在需要在Vercel Dashboard中配置相应的环境变量。

## 📋 Vercel Dashboard配置清单

请在 [Vercel Dashboard](https://vercel.com/dashboard) → 您的项目 → Settings → Environment Variables 中添加以下变量：

### 🔑 必需的环境变量

| 变量名 | 环境 | 值 | 说明 |
|--------|------|-----|------|
| `NEXT_PUBLIC_APP_MODE` | All Environments | `complete` | **应用模式 - 完整模式** |
| `NEXT_PUBLIC_APP_ENV` | Production | `production` | 应用环境 |
| `NEXT_PUBLIC_APP_URL` | Production | `https://your-app.vercel.app` | 替换为您的实际Vercel域名 |
| `NEXT_PUBLIC_SUPABASE_URL` | All Environments | `https://jdsvdwnxfadodrpuauoq.supabase.co` | Supabase项目URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All Environments | `eyJhbGci...knKg` | Supabase匿名密钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | All Environments | `eyJhbGci...t8KM` | Supabase服务角色密钥 |

### 🎨 API密钥（可选功能）

| 变量名 | 环境 | 值 | 说明 |
|--------|------|-----|------|
| `HABIT_WORDS_KEY` | All Environments | `sk-or-v1-a652...4dbb` | AI功能API密钥 |
| `HABIT_IMAGE_TOKEN` | All Environments | `r8_PF0O...3Iz5` | 图像生成API密钥 |

### 📊 分析和调试（可选）

| 变量名 | 环境 | 值 | 说明 |
|--------|------|-----|------|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | All Environments | `habitkids.online` | 分析域名 |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Production | `true` | 启用分析 |
| `NEXT_PUBLIC_ENABLE_DEBUG` | Development/Preview | `true` | 启用调试面板 |

## 🔧 配置步骤

1. **登录Vercel Dashboard**
   - 访问 https://vercel.com/dashboard
   - 选择您的项目

2. **进入环境变量设置**
   - 点击 "Settings"
   - 点击 "Environment Variables"

3. **添加每个变量**
   - 点击 "Add"
   - 输入变量名（如：`NEXT_PUBLIC_APP_MODE`）
   - 输入值（如：`complete`）
   - 选择环境（推荐选择 "All Environments"）
   - 点击 "Save"

4. **重新部署**
   - 回到 "Deployments" 标签
   - 点击最新部署旁的三个点
   - 选择 "Redeploy"

## ✅ 验证配置

部署完成后，访问您的Vercel应用：

1. **检查应用模式**
   - 应用应该显示为"完整模式"
   - 可以正常登录和注册

2. **使用调试面板**
   - 如果设置了 `NEXT_PUBLIC_ENABLE_DEBUG=true`
   - 页面右下角会显示 🔧 调试按钮
   - 点击查看环境配置状态

## 🚨 常见问题

### 问题1: 应用仍显示演示模式
**解决方案**:
- 确保 `NEXT_PUBLIC_APP_MODE=complete`
- 重新部署应用
- 清除浏览器缓存

### 问题2: 无法登录
**解决方案**:
- 检查Supabase URL格式：`https://项目ID.supabase.co`
- 确保Supabase密钥正确
- 在Supabase项目中添加Vercel域名到允许列表

### 问题3: 功能缺失
**解决方案**:
- 检查 `NEXT_PUBLIC_APP_URL` 是否指向正确域名
- 确认所有必需变量都已设置
- 查看Vercel Function Logs是否有错误

## 📞 需要帮助？

如果遇到问题：
1. 运行本地检查：`NODE_ENV=production npm run check-vercel-env`
2. 使用调试面板对比本地和生产环境配置
3. 检查Vercel Deployment Logs
4. 确保Supabase项目配置正确

---

**🎉 恭喜！您的应用现在应该在complete模式下正常运行了！** 