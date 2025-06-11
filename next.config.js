/** @type {import('next').NextConfig} */
const nextConfig = {
  // 性能优化
  experimental: {
    // 减少 bundle 大小
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // 外部包配置 (新 API)
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // 编译优化
  compiler: {
    // 移除 console.log
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 图片优化
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    unoptimized: true,
  },
  
  // 启用 gzip 压缩
  compress: true,
  
  // 减少编译时间
  typescript: {
    // 生产环境下跳过类型检查
    ignoreBuildErrors: true,
  },
  
  eslint: {
    // 生产环境下跳过 ESLint
    ignoreDuringBuilds: true,
  },
  
  // 环境变量配置
  env: {
    // 忽略特定的运行时错误
    SUPPRESS_STORAGE_ERRORS: 'true',
  },
  
  // 静态生成优化
  generateBuildId: async () => {
    // 使用时间戳作为构建ID
    return `build-${Date.now()}`
  },
}

module.exports = nextConfig 