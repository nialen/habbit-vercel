# StarVoyage - 儿童习惯培养平台

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/nialenqueen-8377s-projects/v0-next-js-project-plan)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/x4qEz7v1smf)

## 🌟 项目简介

StarVoyage 是一个专为儿童习惯培养设计的互动平台，帮助家长和孩子一起建立良好的生活习惯，记录成长点滴。

## ✨ 主要功能

- **📱 习惯管理** - 创建和跟踪孩子的日常习惯
- **🤖 AI顾问** - 智能育儿建议和指导
- **🎯 亲子活动** - 丰富的互动活动推荐
- **📊 数据统计** - 可视化的进度跟踪
- **🎁 奖励兑换** - 积分奖励系统
- **💬 家长讨论区** - 家长经验分享社区
- **🔔 通知中心** - 重要提醒和消息

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd habbit-vercel
```

### 2. 安装依赖

```bash
npm install
# 或
pnpm install
```

### 3. 配置环境变量

复制环境变量示例文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，配置您的 Supabase 项目信息：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> **注意：** 如果不配置 Supabase，应用会自动使用模拟数据运行，所有功能均可正常使用。

### 4. 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看您的应用。

## 🗄️ 数据库配置（可选）

如果您想使用真实的数据库而不是模拟数据：

### 1. 创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 创建新项目
3. 获取项目 URL 和 anon key

### 2. 运行数据库迁移

```bash
# 如果您有 supabase CLI
supabase db push

# 或手动在 Supabase 仪表板中运行 SQL
```

### 3. 更新环境变量

将您的实际 Supabase 配置更新到 `.env.local` 文件。

## 🛠️ 技术栈

- **框架：** Next.js 14 (App Router)
- **样式：** Tailwind CSS
- **UI组件：** Radix UI + shadcn/ui
- **数据库：** Supabase (PostgreSQL)
- **认证：** Supabase Auth
- **类型：** TypeScript
- **包管理：** pnpm

## 📁 项目结构

```
├── app/                    # Next.js App Router 页面
├── components/             # React 组件
│   ├── ui/                # UI 组件库
│   └── nav-icon.tsx       # 导航图标组件
├── lib/                   # 工具函数和配置
├── public/                # 静态资源
│   ├── sprites/          # SVG 图标精灵
│   └── avatars/          # 头像图片
├── types/                 # TypeScript 类型定义
└── supabase/             # 数据库配置
```

## 🎨 设计特色

- **响应式设计** - 完美适配移动端和桌面端
- **暖色调界面** - 温馨友好的用户体验
- **卡通图标** - 可爱的自定义 SVG 图标
- **流畅动画** - 现代化的交互体验

## 🚀 部署

项目已配置为在 Vercel 上自动部署。推送到主分支即可触发部署。

**线上地址：** [https://vercel.com/nialenqueen-8377s-projects/v0-next-js-project-plan](https://vercel.com/nialenqueen-8377s-projects/v0-next-js-project-plan)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## �� 许可证

MIT License
