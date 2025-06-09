# 🚀 星航成长营 - Vercel自动部署指南

## 📋 部署准备

### 1. 代码仓库设置
确保你的代码已推送到GitHub仓库，并且包含以下文件：
- `vercel.json` - Vercel配置文件 ✅
- `.github/workflows/deploy.yml` - GitHub Actions工作流程 ✅
- `env.example` - 环境变量模板 ✅

### 2. Vercel项目设置

#### 方法一：通过Vercel网站（推荐）

1. **登录Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用GitHub账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择你的GitHub仓库
   - 点击 "Import"

3. **配置项目**
   - Project Name: `habbit-vercel` 或你喜欢的名称
   - Framework: 自动检测为 Next.js
   - Root Directory: `./` (默认)
   - Build Command: `npm run build`
   - Install Command: `npm install --legacy-peer-deps`

4. **设置环境变量**
   在项目设置中添加以下环境变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
   SUPABASE_SERVICE_ROLE_KEY=你的Supabase服务密钥
   NEXT_PUBLIC_APP_URL=https://你的应用域名.vercel.app
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=habitkids.online
   ```

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成

#### 方法二：通过Vercel CLI

1. **安装Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录并部署**
   ```bash
   vercel login
   vercel --prod
   ```

## 🔄 自动部署流程

一旦设置完成，以下操作会自动触发部署：

### 生产部署
```bash
git add .
git commit -m "feat: 添加新功能"
git push origin main
```
→ 自动部署到生产环境

### 预览部署
```bash
git checkout -b feature/new-feature
git add .
git commit -m "feat: 开发新功能"
git push origin feature/new-feature
# 创建Pull Request
```
→ 自动创建预览部署

## 🌐 域名配置

### 1. 自定义域名（可选）
在Vercel项目设置中：
- 进入 "Domains" 选项卡
- 添加你的自定义域名
- 按照提示配置DNS记录

### 2. 更新Plausible Analytics域名
如果使用自定义域名，记得更新：
- `app/layout.tsx` 中的 `data-domain` 属性
- 环境变量 `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

## 📊 监控和分析

### 构建状态
- 在Vercel Dashboard查看构建日志
- GitHub Actions提供额外的代码质量检查

### 性能监控
- Vercel Analytics（内置）
- Plausible Analytics（已配置）

## 🔧 常见问题解决

### 构建失败
1. 检查依赖冲突：使用 `--legacy-peer-deps`
2. 检查环境变量是否设置正确
3. 查看构建日志定位具体错误

### 部署后访问404
1. 检查路由配置
2. 确认静态文件路径正确

### Supabase连接问题
1. 验证环境变量
2. 检查Supabase项目状态
3. 确认API密钥权限

## 📝 更新流程

```bash
# 1. 开发新功能
git checkout -b feature/your-feature
# ... 进行开发 ...

# 2. 提交代码
git add .
git commit -m "feat: 描述你的更改"

# 3. 推送并创建PR
git push origin feature/your-feature
# 在GitHub创建Pull Request

# 4. 合并到主分支（自动部署生产环境）
# PR被合并后，Vercel自动部署到生产环境
```

## 🎉 完成！

现在你的星航成长营应用已经配置了自动部署！每次代码提交都会自动更新到Vercel。

访问你的应用：`https://your-project.vercel.app`

---
📧 如有问题，请检查Vercel控制台的构建日志或联系技术支持。 