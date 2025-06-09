import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"
import { ENV_CONFIG, isDevelopment, debugLog, errorLog } from "./env"

// 获取环境配置
const { supabase: supabaseConfig } = ENV_CONFIG

// 检查环境变量是否正确配置
const isValidSupabaseConfig = 
  supabaseConfig.url && 
  supabaseConfig.anonKey && 
  supabaseConfig.url !== 'your_dev_supabase_project_url' && 
  supabaseConfig.url !== 'your_prod_supabase_project_url' &&
  supabaseConfig.url.startsWith('https://') &&
  supabaseConfig.anonKey !== 'your_dev_supabase_anon_key' &&
  supabaseConfig.anonKey !== 'your_prod_supabase_anon_key'

// 开发环境可以使用模拟配置
const fallbackUrl = 'https://mock.supabase.co'
const fallbackKey = 'mock-key'

const finalUrl = isValidSupabaseConfig ? supabaseConfig.url : fallbackUrl
const finalKey = isValidSupabaseConfig ? supabaseConfig.anonKey : fallbackKey

// 记录配置状态
if (isDevelopment()) {
  debugLog('Supabase 配置状态', {
    isValidSupabaseConfig,
    url: finalUrl,
    hasAnonKey: !!finalKey,
    hasServiceKey: !!supabaseConfig.serviceRoleKey,
  })
}

// 创建 Supabase 客户端
export const supabase = isValidSupabaseConfig 
  ? createClient<Database>(finalUrl, finalKey)
  : null

// 客户端专用的 Supabase 实例
export const createClientComponentClient = () => {
  if (!isValidSupabaseConfig) {
    const message = '⚠️ Supabase 配置无效，使用模拟数据模式'
    if (isDevelopment()) {
      debugLog(message)
    } else {
      errorLog(message)
    }
    return null
  }
  return createClient<Database>(finalUrl, finalKey)
}

// 服务端专用的 Supabase 实例（使用 Service Role Key）
export const createServiceClient = () => {
  if (!isValidSupabaseConfig || !supabaseConfig.serviceRoleKey) {
    const message = '⚠️ Supabase Service Role Key 未配置'
    errorLog(message)
    return null
  }
  return createClient<Database>(finalUrl, supabaseConfig.serviceRoleKey)
}

// 导出配置状态
export const isSupabaseConfigured = isValidSupabaseConfig

// 导出环境信息（用于调试）
export const supabaseEnvironmentInfo = {
  isConfigured: isValidSupabaseConfig,
  environment: process.env.NODE_ENV,
  databaseEnvironment: process.env.DATABASE_ENVIRONMENT,
  url: finalUrl,
}
