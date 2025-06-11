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
  
  // 跳过出错的页面，允许构建继续
  onDemandEntries: {
    // 页面在开发中将在此时间段后被处置（以毫秒为单位）
    maxInactiveAge: 25 * 1000,
    // 应该同时保留的页面数
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig 