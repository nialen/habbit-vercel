# 🎯 切换到完整模式指南

恭喜！你即将从演示模式切换到完整模式，享受真实的数据存储和完整功能。

## 📋 准备工作

### 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com) 并注册/登录
2. 点击 "New Project"
3. 选择组织（或创建新的）
4. 填写项目信息：
   - **Name**: `habit-kids` (或你喜欢的名字)
   - **Database Password**: 创建强密码（记住它！）
   - **Region**: 选择离你最近的区域
5. 点击 "Create new project"
6. 等待项目初始化（约2-3分钟）

### 2. 获取 Supabase 配置信息

项目创建完成后：

1. 在项目面板中，点击左侧的 **⚙️ Settings**
2. 选择 **API** 标签页
3. 复制以下信息：
   - **Project URL** (类似: `https://xxxxx.supabase.co`)
   - **anon public key** (以 `eyJ` 开头的长字符串)
   - **service_role key** (点击 👁️ 显示后复制)

## 🔧 配置步骤

### 1. 更新环境变量

编辑项目根目录的 `env.local` 文件，将示例值替换为你的实际值：

```bash
# 你的 OpenAI 和 Replicate API Keys (已配置)
HABIT_WORDS_KEY=sk-or-v1-xxx...
HABIT_IMAGE_TOKEN=r8_xxx...

# ⚠️ 替换为你的实际 Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development

# Plausible Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=habitkids.online
```

### 2. 运行数据库迁移

安装 Supabase CLI（如果还没有）：

```bash
# 使用 npm
npm install -g supabase

# 或使用其他方式，参考: https://supabase.com/docs/guides/cli
```

然后运行迁移：

```bash
# 1. 初始化 Supabase
supabase init

# 2. 链接到你的项目
supabase link --project-ref your-project-id

# 3. 推送数据库迁移
supabase db push
```

**或者手动运行 SQL：**

如果你不想安装 CLI，可以在 Supabase 面板中手动运行 SQL：

1. 在 Supabase 项目面板中，点击左侧的 **🗃️ SQL Editor**
2. 按顺序运行以下文件中的 SQL：
   - `supabase/migrations/20240601_create_posts_comments.sql`
   - `supabase/migrations/20240602_create_user_profiles.sql`
   - `supabase/migrations/20240603_create_habits_tables.sql`

### 3. 重启开发服务器

```bash
npm run dev
```

## ✅ 验证设置

### 1. 检查数据库连接

访问 http://localhost:3000，你应该看到：

- 不再有 "模拟数据" 的提示
- 可以正常注册/登录
- 创建的数据会真实保存

### 2. 测试功能

**用户注册/登录：**
- 访问应用，系统会提示你注册或登录
- 使用真实邮箱注册（会收到确认邮件）

**习惯管理：**
- 创建新习惯
- 完成打卡
- 数据会保存到数据库

**社区功能：**
- 发布帖子
- 评论和点赞
- 数据持久化存储

### 3. 在 Supabase 面板中验证

1. 进入 Supabase 项目面板
2. 点击左侧的 **🗃️ Table Editor**
3. 查看表格中的数据：
   - `user_profiles` - 用户资料
   - `habits` - 习惯数据
   - `habit_logs` - 打卡记录
   - `posts` - 社区帖子
   - `comments` - 评论

## 🚀 部署到生产环境

### 1. 更新 Vercel 环境变量

在 Vercel 项目设置中添加：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_ENV=production
```

### 2. 推送代码并部署

```bash
git add .
git commit -m "feat: 切换到完整模式，连接 Supabase 数据库"
git push origin main
```

## 🎊 功能对比

| 功能 | 演示模式 | 完整模式 |
|------|----------|----------|
| 用户认证 | 模拟登录 | ✅ 真实注册/登录 |
| 数据存储 | 本地临时 | ✅ 云端数据库 |
| 习惯管理 | 模拟数据 | ✅ 真实 CRUD |
| 社区功能 | 静态内容 | ✅ 实时互动 |
| 奖励系统 | 假积分 | ✅ 真实积分系统 |
| 数据统计 | 模拟图表 | ✅ 真实数据可视化 |
| 数据备份 | ❌ 无 | ✅ 自动备份 |
| 多设备同步 | ❌ 无 | ✅ 云端同步 |

## 🛟 常见问题

### Q: 我的数据库迁移失败了

**A:** 检查以下几点：
1. Supabase 项目是否创建成功
2. 环境变量是否正确配置
3. 网络连接是否正常
4. 手动在 SQL Editor 中运行迁移文件

### Q: 登录后没有用户数据

**A:** 首次登录后需要创建用户资料：
1. 系统会自动提示完善个人信息
2. 填写孩子姓名和年龄
3. 数据会自动保存到 `user_profiles` 表

### Q: 想回到演示模式

**A:** 只需在 `env.local` 中注释掉 Supabase 配置：

```bash
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

然后重启开发服务器即可。

### Q: 生产环境配置不同吗？

**A:** 是的，生产环境需要：
1. 在 Vercel 中配置相同的环境变量
2. 将 `NEXT_PUBLIC_APP_ENV` 设为 `production`
3. 确保 Supabase RLS (行级安全) 策略正确

## 🎯 下一步

完成设置后，你可以：

1. **邀请家庭成员** - 多人共同管理孩子习惯
2. **设置数据备份** - Supabase 自动备份，也可导出
3. **自定义功能** - 基于真实数据开发新功能
4. **性能优化** - 监控和优化数据库查询
5. **添加通知** - 配置邮件和推送通知

🎉 **恭喜！你现在拥有一个完全功能的儿童习惯养成应用！** 