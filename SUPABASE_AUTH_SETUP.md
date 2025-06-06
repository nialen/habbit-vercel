# Supabase 认证设置指南

本项目已集成 Supabase 服务端认证（使用 @supabase/ssr 包），支持无邮箱验证的注册登录。

## 🚀 快速设置

### 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com) 并创建账户
2. 创建新项目
3. 等待数据库初始化完成

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填入以下信息：

```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

在 Supabase Dashboard 的 Settings > API 页面可以找到这些值。

### 3. 执行数据库迁移

在 Supabase Dashboard 的 SQL Editor 中执行 `supabase/schema.sql` 文件中的 SQL 语句，创建所需的表结构和安全策略。

### 4. 配置认证设置

在 Supabase Dashboard 的 Authentication > Settings 中：

#### 禁用邮箱验证
- 将 "Enable email confirmations" 设置为 **关闭**
- 这样用户注册后无需邮箱验证即可直接登录

#### 配置重定向 URL（可选）
如果需要邮箱验证，在 "Redirect URLs" 中添加：
- `http://localhost:3000/auth/callback` (开发环境)
- `https://your-domain.com/auth/callback` (生产环境)

## 🔧 功能特性

### ✅ 已实现功能

- **服务端认证**：使用 @supabase/ssr 确保安全的服务端渲染
- **免邮箱验证注册**：用户注册后立即可用，无需邮箱确认
- **中间件保护**：自动重定向未认证用户到登录页
- **认证状态管理**：全局认证上下文，支持登录状态同步
- **安全的数据库策略**：行级安全策略确保数据隔离

### 🛡️ 安全特性

- **行级安全策略（RLS）**：确保用户只能访问自己的数据
- **服务端认证验证**：在服务端验证用户身份
- **Cookie 安全管理**：安全的会话 Cookie 处理
- **CSRF 保护**：内置跨站请求伪造保护

## 📱 使用方法

### 用户注册/登录

1. 访问 `/login` 页面
2. 选择"注册"或"登录"
3. 输入邮箱和密码（密码至少6位）
4. 点击提交即可完成认证

### 登出

在任何页面点击"退出登录"按钮即可登出。

## 🔍 技术实现

### 文件结构

```
lib/supabase/
├── server.ts          # 服务端 Supabase 客户端
├── client.ts          # 客户端 Supabase 客户端
└── schema.sql         # 数据库结构

contexts/
└── auth.tsx           # 认证上下文

middleware.ts          # 认证中间件

app/
├── login/             # 登录页面
└── auth/
    ├── callback/      # 认证回调处理
    └── auth-code-error/ # 认证错误页面
```

### 认证流程

1. **中间件检查**：所有请求先经过 `middleware.ts` 验证认证状态
2. **服务端验证**：使用 `lib/supabase/server.ts` 在服务端验证用户
3. **客户端同步**：`contexts/auth.tsx` 管理客户端认证状态
4. **路由保护**：`components/auth-guard.tsx` 保护需要认证的页面

## 🚨 故障排除

### 常见问题

1. **"环境变量未配置"**
   - 检查 `.env.local` 文件是否存在
   - 确认环境变量名称正确

2. **"认证失败"**
   - 检查 Supabase URL 和密钥是否正确
   - 确认数据库表已创建

3. **"用户被重定向到登录页"**
   - 这是正常行为，表示认证中间件正常工作
   - 完成登录后会自动重定向到原页面

### 开发调试

在开发环境中，认证相关日志会输出到控制台，帮助调试问题。

## 🎯 下一步

设置完成后，你可以：

1. 自定义登录页面样式
2. 添加第三方登录（Google、GitHub 等）
3. 实现用户资料管理
4. 配置邮箱模板（如果启用邮箱验证）

---

如需更多帮助，请查看 [Supabase 官方文档](https://supabase.com/docs/guides/auth)。 