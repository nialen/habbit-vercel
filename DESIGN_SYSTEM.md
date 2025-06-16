# 🎨 儿童习惯养成平台 - 设计系统规范

## 📋 设计原则
- **现代简洁**：去除过度装饰，保持清爽
- **专业亲和**：既专业又温暖，适合家长和孩子
- **一致性**：所有界面元素保持统一风格
- **可访问性**：确保良好的对比度和可读性

## 🎨 配色方案

### 主色调
\`\`\`css
/* 主要渐变 */
--gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
--gradient-primary-hover: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);

/* 背景渐变 */
--gradient-background: linear-gradient(135deg, #312e81 0%, #7c3aed 50%, #3b82f6 100%);
--gradient-background-light: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);

/* 单色 */
--color-primary: #8b5cf6;
--color-primary-dark: #7c3aed;
--color-secondary: #3b82f6;
--color-accent: #06b6d4;
\`\`\`

### 中性色
\`\`\`css
--color-white: #ffffff;
--color-gray-50: #f8fafc;
--color-gray-100: #f1f5f9;
--color-gray-200: #e2e8f0;
--color-gray-300: #cbd5e1;
--color-gray-400: #94a3b8;
--color-gray-500: #64748b;
--color-gray-600: #475569;
--color-gray-700: #334155;
--color-gray-800: #1e293b;
--color-gray-900: #0f172a;
\`\`\`

### 功能色
\`\`\`css
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;
\`\`\`

## 🔤 字体规范

### 字体族
\`\`\`css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-heading: 'Poppins', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
\`\`\`

### 字体大小
\`\`\`css
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */
--text-6xl: 3.75rem;    /* 60px */
\`\`\`

### 字重
\`\`\`css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
\`\`\`

## 📐 间距规范

### 基础间距
\`\`\`css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
\`\`\`

## 🎯 组件规范

### 按钮样式
\`\`\`css
/* 主要按钮 */
.btn-primary {
  background: var(--gradient-primary);
  color: white;
  padding: 12px 32px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.btn-primary:hover {
  background: var(--gradient-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

/* 次要按钮 */
.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

/* 幽灵按钮 */
.btn-ghost {
  background: transparent;
  color: var(--color-gray-600);
  border: 1px solid var(--color-gray-200);
}
\`\`\`

### 卡片样式
\`\`\`css
.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card-dark {
  background: rgba(30, 41, 59, 0.95);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
\`\`\`

### 输入框样式
\`\`\`css
.input {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(203, 213, 225, 0.5);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  background: white;
}
\`\`\`

## 🎭 动画规范

### 过渡时间
\`\`\`css
--transition-fast: 0.15s;
--transition-normal: 0.3s;
--transition-slow: 0.5s;
\`\`\`

### 缓动函数
\`\`\`css
--ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
\`\`\`

### 常用动画
\`\`\`css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
\`\`\`

## 📱 响应式断点

\`\`\`css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
\`\`\`

## 🎨 背景样式

### 主背景
\`\`\`css
.bg-primary {
  background: var(--gradient-background);
  min-height: 100vh;
  position: relative;
}

.bg-light {
  background: var(--gradient-background-light);
}

.bg-glass {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
\`\`\`

### 装饰元素
\`\`\`css
.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}
\`\`\`

## 🔍 使用指南

### 页面结构
1. **背景**：使用 `bg-primary` 或 `bg-light`
2. **主容器**：使用 `card` 样式
3. **按钮**：根据重要性选择 `btn-primary`、`btn-secondary` 或 `btn-ghost`
4. **文字**：使用规范的字体大小和颜色
5. **间距**：使用标准间距变量

### 弹窗规范
- 背景使用毛玻璃效果
- 圆角统一使用 20px
- 按钮使用主要样式
- 添加适当的动画效果

### 图标规范
- 优先使用 Lucide React 图标
- 图标大小：16px、20px、24px、32px
- 颜色与文字保持一致
- 添加适当的悬停效果
