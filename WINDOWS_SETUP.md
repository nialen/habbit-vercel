# Windows环境配置指南 - 星航成长营 StarVoyage

## 🪟 Windows特殊说明

本项目已针对Windows环境进行了优化配置。

## ✅ 解决的Windows兼容性问题

### 1. 环境变量设置
- **问题**: Windows不支持 `NODE_ENV=development` 语法
- **解决方案**: 使用 `cross-env` 包统一处理跨平台环境变量

### 2. 文件删除命令
- **问题**: Windows不支持 `rm -rf` 命令
- **解决方案**: 使用 `rimraf` 包进行跨平台文件删除

### 3. 脚本执行
- **问题**: Windows批处理文件在Git Bash中执行困难
- **解决方案**: 统一使用Node.js脚本替代bash脚本

## 🚀 Windows快速开始

### 1. 安装依赖
```bash
npm install --legacy-peer-deps
```

### 2. 创建环境配置
```bash
# 创建环境配置模板
npm run create-env-templates

# 设置开发环境
npm run setup-env:dev

# 设置生产环境
npm run setup-env:prod
```

### 3. 启动开发
```bash
# 开发环境
npm run dev

# 生产模式
npm run dev:prod
```

## 🔧 Windows专用命令

| 命令 | Windows版本 | 说明 |
|------|-------------|------|
| `npm run dev` | `cross-env NODE_ENV=development next dev` | 启动开发服务器 |
| `npm run build:dev` | `cross-env NODE_ENV=development next build` | 构建开发版本 |
| `npm run clean` | `rimraf .next out` | 清理构建文件 |
| `npm run setup-env:dev` | `node scripts/setup-env.js development` | 设置开发环境 |

## ✅ 已安装的Windows兼容包

```json
{
  "devDependencies": {
    "cross-env": "^7.0.3",
    "rimraf": "^6.0.1"
  }
}
```

## 🚨 Windows常见问题解决

### 问题1: `'NODE_ENV' 不是内部或外部命令`
**解决**: 使用npm脚本而不是直接设置环境变量
```bash
# ❌ 错误方式
NODE_ENV=development npm run dev

# ✅ 正确方式  
npm run dev
```

### 问题2: `bash: rm: command not found`
**解决**: 使用npm脚本清理文件
```bash
# ❌ 错误方式
rm -rf .next

# ✅ 正确方式
npm run clean
```

### 问题3: 批处理文件无法执行
**解决**: 所有脚本已更新为Node.js版本
```bash
# ✅ 所有这些命令在Windows下都能正常工作
npm run create-env-templates
npm run setup-env:dev
npm run setup-env:prod
```

## 🎯 验证配置

运行以下命令验证配置是否正确：

```bash
# 检查环境状态
npm run check-env

# 验证TypeScript
npm run type-check

# 检查代码规范
npm run lint

# 清理并重新构建
npm run clean && npm run build:dev
```

## 🔗 下一步

1. 编辑 `.env.development` 文件填入开发环境配置
2. 编辑 `.env.production` 文件填入生产环境配置  
3. 运行 `npm run dev` 启动开发服务器
4. 访问 http://localhost:3000 查看应用

---

🎉 **恭喜！你的Windows开发环境已配置完成！** 