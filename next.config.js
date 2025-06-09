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
  },
  
  // 启用 gzip 压缩
  compress: true,
  
  // 减少编译时间
  typescript: {
    // 生产环境下跳过类型检查（假设CI/CD已经检查过）
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  
  eslint: {
    // 生产环境下跳过 ESLint（假设CI/CD已经检查过）
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  
  // Webpack 优化
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // 生产环境优化
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // 将 React 相关库分离
          react: {
            name: 'react',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            priority: 20,
          },
          // 将 UI 库分离
          ui: {
            name: 'ui',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](@radix-ui|@supabase|lucide-react)[\\/]/,
            priority: 15,
          },
          // 通用库
          common: {
            name: 'common',
            chunks: 'all',
            minChunks: 2,
            priority: 10,
          },
        },
      }
    }
    
    return config
  },
}

module.exports = nextConfig 