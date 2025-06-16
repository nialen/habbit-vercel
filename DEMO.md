# 🎯 演示模式使用指南

## 🚀 如何启动演示模式

StarVoyage 应用支持两种运行模式：

### 1. 演示模式（推荐新用户）
**无需配置数据库，立即体验所有功能**

#### 启动步骤：
\`\`\`bash
# 1. 克隆项目
git clone <repository-url>
cd habbit-vercel

# 2. 安装依赖
npm install

# 3. 创建演示配置（或不创建任何 .env.local 文件）
echo "# 演示模式 - 使用模拟数据" > .env.local

# 4. 启动应用
npm run dev
\`\`\`

#### 演示模式特点：
- ✅ **全功能可用** - 所有页面和功能都可以正常使用
- ✅ **模拟数据** - 预设了示例用户、习惯记录和社区帖子
- ✅ **即时体验** - 无需注册登录，直接进入应用
- ✅ **数据模拟** - 操作会有反馈，但不会持久化存储

#### 模拟用户信息：
- **用户名**: 小明妈妈
- **孩子姓名**: 小明
- **孩子年龄**: 6岁
- **邮箱**: demo@example.com

#### 预设数据：
- **习惯记录**: 5个示例习惯（早睡早起、刷牙洗脸等）
- **亲子活动**: 4个推荐活动
- **社区帖子**: 丰富的家长讨论内容
- **积分系统**: 完整的奖励机制

### 2. 完整模式（生产环境）
**连接真实数据库，持久化数据存储**

#### 配置步骤：
\`\`\`bash
# 1. 复制环境变量模板
cp .env.example .env.local

# 2. 编辑 .env.local，填入真实的 Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# 3. 启动应用
npm run dev
\`\`\`

## 🎮 演示模式功能体验

### 📱 主要功能页面
- **首页仪表板** `/` - 查看今日概览和快捷功能
- **习惯管理** `/habits` - 创建和管理孩子的习惯
- **AI顾问** `/advisor` - 获取智能育儿建议
- **亲子活动** `/activities` - 浏览推荐的亲子活动
- **数据统计** `/statistics` - 可视化的成长数据
- **奖励兑换** `/rewards` - 积分商城和奖励系统
- **家长讨论区** `/community` - 社区交流和经验分享
- **通知中心** `/notifications` - 消息和提醒管理

### 🎯 可体验的操作
- ✅ 习惯打卡和取消
- ✅ 创建新习惯
- ✅ 发布社区帖子
- ✅ 评论和点赞
- ✅ 查看统计图表
- ✅ 兑换奖励
- ✅ AI问答交互

### ⚠️ 演示模式限制
- 数据不会真正保存到数据库
- 刷新页面后某些操作会重置
- 无法真正发送邮件通知
- 登录状态是模拟的

## 🔄 切换到完整模式

如果您想从演示模式升级到完整模式：

1. **创建 Supabase 项目**
   - 访问 [supabase.com](https://supabase.com)
   - 创建新项目
   - 复制项目 URL 和 anon key

2. **更新环境变量**
   \`\`\`bash
   # 编辑 .env.local
   NEXT_PUBLIC_SUPABASE_URL=https://your-real-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-real-anon-key
   \`\`\`

3. **重启应用**
   \`\`\`bash
   npm run dev
   \`\`\`

## 💡 提示

- 演示模式非常适合了解应用功能和界面
- 如果只是想快速体验，推荐使用演示模式
- 需要真实数据存储时，再切换到完整模式

**立即开始体验：** `npm run dev` 🚀
