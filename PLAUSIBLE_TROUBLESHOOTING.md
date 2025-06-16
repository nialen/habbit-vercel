# 📊 Plausible Analytics 故障排除指南

## 🚨 "We couldn't find the Plausible snippet" 错误

这个错误表示Plausible无法在你的网站上检测到分析脚本。以下是解决步骤：

### 1. 确认域名配置

**检查项目:**
- 在Plausible中添加的域名是否与实际部署的域名一致
- 当前配置域名: `habitkids.online`
- 如果你使用不同的域名，需要更新配置

**修复方法:**
\`\`\`bash
# 方法1: 更新环境变量
# 在Vercel项目设置中添加:
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=你的实际域名.com

# 方法2: 直接修改layout.tsx
# 将 "habitkids.online" 改为你的域名
\`\`\`

### 2. 检查部署环境

**开发环境 (localhost:3000):**
- ✅ **正常行为**: Plausible脚本不会在本地加载
- ✅ **调试模式**: 控制台会显示 "🔍 [Plausible Debug]" 信息
- ❌ **不会发送数据**: 仅在生产环境发送

**生产环境 (Vercel部署):**
- ✅ **必须条件**: 网站必须部署到生产环境
- ✅ **域名匹配**: Vercel域名或自定义域名
- ✅ **HTTPS**: Plausible仅支持HTTPS网站

### 3. 验证脚本加载

**在生产环境中检查:**

1. **打开浏览器开发者工具** (F12)
2. **查看Network标签页**
3. **刷新页面**
4. **搜索**: `plausible.io`
5. **应该看到**: `script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js`

**如果没有看到脚本加载:**
\`\`\`bash
# 检查构建是否成功
npm run build

# 检查生产环境变量
echo $NODE_ENV  # 应该是 "production"
\`\`\`

### 4. 常见解决方案

#### 方案A: 重新配置域名

1. **登录Plausible Dashboard**
2. **添加网站**: 使用你的实际部署域名
   - Vercel域名: `你的项目名.vercel.app`
   - 自定义域名: `你的域名.com`
3. **更新代码**:
   \`\`\`bash
   # 更新环境变量
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=你的新域名
   \`\`\`

#### 方案B: 使用测试域名

如果想立即测试，可以暂时使用一个测试域名：

\`\`\`typescript
// 在 app/layout.tsx 中临时修改
const PLAUSIBLE_DOMAIN = "你的vercel域名.vercel.app"
\`\`\`

#### 方案C: 强制加载脚本（仅用于测试）

\`\`\`typescript
// 临时解决方案 - 在开发环境也加载脚本
const IS_PRODUCTION = true // 临时设为true进行测试
\`\`\`

⚠️ **注意**: 测试完成后记得改回 `process.env.NODE_ENV === "production"`

### 5. 部署后验证步骤

1. **部署到Vercel**:
   \`\`\`bash
   git add .
   git commit -m "fix: 更新Plausible配置"
   git push origin main
   \`\`\`

2. **等待部署完成** (~2-3分钟)

3. **访问生产网站**:
   - 打开 `https://你的项目.vercel.app`
   - 不要使用localhost

4. **在Plausible中验证**:
   - 访问: https://plausible.io/你的域名
   - 点击 "Verify installation"
   - 应该显示 "✅ Snippet installed correctly"

### 6. 测试页面使用

访问测试页面验证分析功能：
\`\`\`
https://你的域名/test-analytics
\`\`\`

**在测试页面中:**
- 检查 "分析状态" 显示
- 点击测试按钮
- 查看浏览器控制台输出

### 7. 高级调试

**检查脚本内容:**
\`\`\`javascript
// 在浏览器控制台执行
console.log('Plausible loaded:', !!window.plausible)
console.log('Environment:', process.env.NODE_ENV)
console.log('Domain:', document.querySelector('[data-domain]')?.getAttribute('data-domain'))
\`\`\`

**手动触发事件:**
\`\`\`javascript
// 在生产环境的浏览器控制台测试
if (window.plausible) {
  window.plausible('Test Event', { props: { source: 'manual' } })
  console.log('✅ 事件已发送')
} else {
  console.log('❌ Plausible未加载')
}
\`\`\`

## 📋 检查清单

在联系支持之前，请确认：

- [ ] 网站已部署到生产环境（不是localhost）
- [ ] 在Plausible中添加了正确的域名
- [ ] 域名配置与实际部署域名一致
- [ ] 网站使用HTTPS协议
- [ ] 脚本在Network标签页中可见
- [ ] 没有浏览器广告拦截器阻止脚本
- [ ] 等待了3-5分钟让数据同步

## 🔗 有用链接

- [Plausible文档](https://plausible.io/docs)
- [Vercel部署指南](./DEPLOYMENT.md)
- [测试页面](/test-analytics)
- [Plausible Dashboard](https://plausible.io/habitkids.online)

## 💬 获取帮助

如果仍有问题：
1. 查看 [GitHub Issues](https://github.com/你的用户名/habbit-vercel/issues)
2. 创建新Issue并提供：
   - 部署URL
   - 浏览器控制台截图
   - Network标签页截图
   - 环境变量配置（隐藏敏感信息）
