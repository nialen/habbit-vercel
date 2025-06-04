# 星航成长营 StarVoyage - 环境配置指南

## 🌟 概述

本项目支持完全分离的开发和生产环境，确保测试数据与线上数据完全隔离。

## 📁 环境文件结构

```
├── .env.development.example    # 开发环境配置模板
├── .env.production.example     # 生产环境配置模板
├── .env.development           # 开发环境实际配置 (不进入版本控制)
├── .env.production            # 生产环境实际配置 (不进入版本控制)
└── .env.example               # 通用配置模板
```

## 🚀 快速开始

### 1. 创建环境配置模板

```bash
# 生成环境配置模板文件
npm run create-env-templates
```

### 2. 设置开发环境

```bash
# 自动设置开发环境
npm run setup-env:dev

# 或手动复制
cp .env.development.example .env.development
```

### 3. 设置生产环境

```bash
# 自动设置生产环境
npm run setup-env:prod

# 或手动复制
cp .env.production.example .env.production
```

### 4. 编辑配置文件

编辑对应的环境配置文件，填入正确的值：

#### 开发环境 (`.env.development`)
- 开发环境 Supabase 项目 URL 和密钥
- 测试数据库配置
- 开发环境 API 密钥
- 调试模式开启

#### 生产环境 (`.env.production`)
- 生产环境 Supabase 项目 URL 和密钥
- 正式数据库配置
- 生产环境 API 密钥
- 调试模式关闭

## 🛠️ 开发命令

### 开发环境
```bash
# 启动开发服务器 (自动使用 .env.development)
npm run dev

# 构建开发版本
npm run build:dev

# 启动开发版本
npm run start:dev
```

### 生产环境
```bash
# 启动生产模式开发服务器
npm run dev:prod

# 构建生产版本
npm run build:prod

# 启动生产版本
npm run start:prod
```

### 环境管理
```bash
# 检查当前环境配置
npm run check-env

# 清理构建文件
npm run clean

# 预览构建结果
npm run preview
```

## 🔧 环境变量说明

### 核心配置

| 变量 | 开发环境 | 生产环境 | 说明 |
|------|----------|----------|------|
| `NODE_ENV` | development | production | Node.js 环境 |
| `NEXT_PUBLIC_APP_ENV` | development | production | 应用环境 |
| `DATABASE_ENVIRONMENT` | development | production | 数据库环境标识 |

### 应用配置

| 变量 | 开发环境示例 | 生产环境示例 |
|------|-------------|-------------|
| `NEXT_PUBLIC_APP_URL` | http://localhost:3000 | https://habitkids.online |
| `NEXT_PUBLIC_APP_NAME` | 星航成长营 StarVoyage (开发) | 星航成长营 StarVoyage |

### 数据库配置

| 变量 | 说明 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务端密钥 |

### 分析配置

| 变量 | 开发环境 | 生产环境 |
|------|----------|----------|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | dev.habitkids.online | habitkids.online |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | false | true |

### 调试配置

| 变量 | 开发环境 | 生产环境 |
|------|----------|----------|
| `NEXT_PUBLIC_ENABLE_DEBUG` | true | false |
| `NEXT_PUBLIC_ENABLE_CONSOLE_LOGS` | true | false |

## 📊 环境状态检查

代码中可以使用环境管理工具：

```typescript
import { isDevelopment, isProduction, ENV_CONFIG, debugLog } from '@/lib/env'

// 检查环境
if (isDevelopment()) {
  debugLog('当前运行在开发环境')
}

// 获取配置
const { supabase, app } = ENV_CONFIG

// 调试日志（仅在开发环境输出）
debugLog('用户操作', { userId: 123, action: 'login' })
```

## 🔐 安全注意事项

1. **永远不要提交实际的环境配置文件**
   - `.env.development` 和 `.env.production` 已在 `.gitignore` 中排除

2. **生产环境密钥管理**
   - 在 Vercel 等部署平台中设置环境变量
   - 不要在代码中硬编码任何密钥

3. **数据库隔离**
   - 开发和生产使用完全不同的 Supabase 项目
   - 确保测试数据不会影响生产数据

## 🚨 故障排除

### 环境变量未生效

1. 检查文件名是否正确：`.env.development` 或 `.env.production`
2. 重启开发服务器：`npm run dev`
3. 检查环境状态：`npm run check-env`

### Supabase 连接问题

1. 确认 URL 格式：`https://your-project-id.supabase.co`
2. 验证密钥是否正确
3. 检查项目是否启用了匿名访问

### 构建错误

1. 清理构建文件：`npm run clean`
2. 重新安装依赖：`npm install --legacy-peer-deps`
3. 检查 TypeScript 错误：`npm run type-check`

## 📝 环境迁移

### 从旧配置迁移

如果你之前使用 `.env.local`：

1. 备份现有配置：`cp .env.local .env.local.backup`
2. 创建新环境文件：`npm run setup-env:dev`
3. 将配置迁移到对应的环境文件
4. 删除旧的 `.env.local` 文件

### 团队协作

1. 每个开发者创建自己的 `.env.development`
2. 通过文档分享配置模板和说明
3. 生产环境配置由项目负责人统一管理

---

🎉 **配置完成后，你就可以享受完全隔离的开发和生产环境了！** 