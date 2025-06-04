/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    // 只包含自定义环境变量，不包含NODE_ENV
    DATABASE_ENVIRONMENT: process.env.DATABASE_ENVIRONMENT,
  },
  // 使用新的serverExternalPackages替代experimental.serverComponentsExternalPackages
  serverExternalPackages: ['@supabase/supabase-js'],
}

export default nextConfig