/**
 * 环境配置管理工具
 * Environment configuration management utility
 */

// 环境类型定义
export type Environment = 'development' | 'production' | 'test'

// 获取当前环境
export function getEnvironment(): Environment {
  const env = process.env.NODE_ENV || process.env.NEXT_PUBLIC_APP_ENV
  
  if (env === 'production') return 'production'
  if (env === 'test') return 'test'
  return 'development'
}

// 判断是否为开发环境
export function isDevelopment(): boolean {
  return getEnvironment() === 'development'
}

// 判断是否为生产环境
export function isProduction(): boolean {
  return getEnvironment() === 'production'
}

// 判断是否为测试环境
export function isTest(): boolean {
  return getEnvironment() === 'test'
}

// 环境配置接口
interface EnvironmentConfig {
  supabase: {
    url: string
    anonKey: string
    serviceRoleKey?: string
  }
  app: {
    name: string
    url: string
    enableAnalytics: boolean
    enableDebug: boolean
  }
  plausible: {
    domain: string
  }
  api: {
    baseUrl: string
  }
}

// 获取环境配置
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = getEnvironment()
  
  // 基础配置
  const config: EnvironmentConfig = {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    app: {
      name: process.env.NEXT_PUBLIC_APP_NAME || '星航成长营 StarVoyage',
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
      enableDebug: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
    },
    plausible: {
      domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'habitkids.online',
    },
    api: {
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
    },
  }

  // 开发环境特定配置
  if (isDevelopment()) {
    config.app.enableDebug = true
    config.app.enableAnalytics = false
    config.app.name += ' (开发)'
  }

  // 生产环境特定配置
  if (isProduction()) {
    config.app.enableDebug = false
    config.app.enableAnalytics = true
  }

  return config
}

// 数据库环境配置
export function getDatabaseEnvironment(): string {
  return process.env.DATABASE_ENVIRONMENT || getEnvironment()
}

// 调试日志（仅在开发环境输出）
export function debugLog(message: string, data?: any): void {
  if (isDevelopment() && process.env.NEXT_PUBLIC_ENABLE_CONSOLE_LOGS === 'true') {
    console.log(`[${getEnvironment().toUpperCase()}] ${message}`, data || '')
  }
}

// 错误日志（所有环境都输出）
export function errorLog(message: string, error?: any): void {
  console.error(`[${getEnvironment().toUpperCase()}] ERROR: ${message}`, error || '')
}

// 导出配置常量
export const ENV_CONFIG = getEnvironmentConfig()
export const IS_DEV = isDevelopment()
export const IS_PROD = isProduction()
export const DATABASE_ENV = getDatabaseEnvironment()
