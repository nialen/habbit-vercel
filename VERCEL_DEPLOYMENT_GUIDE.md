# 🚀 Vercel部署配置指南

## 🔍 本地vs生产环境差异问题诊断

如果您的应用在Vercel上的表现与本地不同，请按以下步骤排查：

### 1. 📊 环境变量检查

#### 在本地运行诊断脚本：
```bash
npm run check-vercel-env
```

#### 在Vercel项目中配置环境变量：

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入您的项目
3. 点击 "Settings" → "Environment Variables"
4. 添加以下**必需**的环境变量：

| 变量名 | 环境 | 示例值 | 说明 |
|--------|------|--------|------|
| `NEXT_PUBLIC_APP_MODE` | All | `complete` | 应用模式：`demo` 或 `complete` |
| `NEXT_PUBLIC_APP_ENV` | All | `production` | 应用环境：`development` 或 `production` |
| `NEXT_PUBLIC_APP_URL` | All | `https://your-app.vercel.app` | 您的应用URL |
| `NEXT_PUBLIC_SUPABASE_URL` | All | `https://xxx.supabase.co` | Supabase项目URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | `eyJhbGci...` | Supabase匿名密钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | All | `eyJhbGci...` | Supabase服务角色密钥 |

#### 可选环境变量：

| 变量名 | 环境 | 示例值 | 说明 |
|--------|------|--------|------|
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | All | `true` | 启用分析 |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | All | `your-domain.com` | Plausible域名 |
| `NEXT_PUBLIC_ENABLE_DEBUG` | Development | `true` | 启用调试模式 |
| `HABIT_WORDS_KEY` | All | `sk-...` | AI功能API密钥 |

### 2. 🎯 常见问题解决方案

#### 问题1: 应用显示为演示模式
**症状**: 在Vercel上显示"演示模式"，但本地是"完整模式"
**解决方案**:
- 确保在Vercel中设置 `NEXT_PUBLIC_APP_MODE=complete`
- 检查Supabase配置是否正确

#### 问题2: 认证功能不工作
**症状**: 无法登录或注册
**解决方案**:
- 检查 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 确保Supabase URL不包含占位符文本
- 在Supabase项目中添加您的Vercel域名到允许的URL列表

#### 问题3: 样式或功能缺失
**症状**: 页面布局或功能与本地不同
**解决方案**:
- 检查 `NEXT_PUBLIC_APP_ENV` 是否设置为 `production`
- 确保 `NEXT_PUBLIC_APP_URL` 指向正确的域名
- 清除Vercel缓存并重新部署

#### 问题4: API调用失败
**症状**: 数据加载失败或API错误
**解决方案**:
- 检查 `NEXT_PUBLIC_APP_URL` 是否正确
- 确保API端点路径正确
- 检查CORS配置

### 3. 🔧 调试工具

#### 启用生产环境调试：
在Vercel中添加环境变量：
```
NEXT_PUBLIC_ENABLE_DEBUG=true
```

这将在生产环境中显示调试面板，帮助您诊断问题。

#### 查看构建日志：
1. 在Vercel Dashboard中进入您的项目
2. 点击 "Deployments"
3. 点击最新的部署
4. 查看 "Build Logs" 和 "Function Logs"

### 4. 📋 部署检查清单

在每次部署前确认：

- [ ] ✅ 所有必需的环境变量已在Vercel中配置
- [ ] ✅ `NEXT_PUBLIC_APP_MODE` 设置正确（通常为 `complete`）
- [ ] ✅ `NEXT_PUBLIC_APP_ENV` 设置为 `production`
- [ ] ✅ `NEXT_PUBLIC_APP_URL` 指向正确的Vercel域名
- [ ] ✅ Supabase URL和密钥对应正确的项目环境
- [ ] ✅ 在Supabase中添加了Vercel域名到允许列表
- [ ] ✅ 本地测试通过 `npm run build && npm run start`

### 5. 🚀 推荐的部署流程

1. **本地验证**:
   ```bash
   npm run check-vercel-env  # 检查环境变量
   npm run build             # 构建生产版本
   npm run start             # 本地测试生产版本
   ```

2. **Vercel配置**:
   - 配置所有必需的环境变量
   - 设置正确的域名

3. **部署和验证**:
   - 推送代码到Git仓库
   - 等待Vercel自动部署
   - 访问生产URL验证功能

4. **问题排查**:
   - 如有问题，启用调试模式
   - 检查浏览器控制台和Network标签
   - 使用调试面板查看环境配置

### 6. 📞 支持和故障排除

如果按照上述步骤仍有问题：

1. 运行 `npm run check-vercel-env` 并截图结果
2. 检查浏览器开发者工具的Console和Network标签
3. 比较本地和生产环境的调试面板信息
4. 查看Vercel的Function Logs是否有错误信息

### 7. 🔄 缓存清理

如果更改了环境变量但问题仍然存在：

1. 在Vercel Dashboard中重新部署项目
2. 清除浏览器缓存
3. 使用无痕模式测试
4. 等待CDN缓存更新（通常1-5分钟）

---

**💡 提示**: 使用调试面板（右下角的🔧按钮）可以实时查看环境配置，这是诊断问题最快的方法！ 