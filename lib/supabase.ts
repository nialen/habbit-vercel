import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 检查环境变量是否正确配置
const isValidSupabaseConfig = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your-project-url/' && 
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey !== 'your-anon-key'

// 如果环境变量未正确配置，使用模拟配置（仅用于开发）
const fallbackUrl = 'https://mock.supabase.co'
const fallbackKey = 'mock-key'

const finalUrl = isValidSupabaseConfig ? supabaseUrl! : fallbackUrl
const finalKey = isValidSupabaseConfig ? supabaseAnonKey! : fallbackKey

// 创建 Supabase 客户端（如果配置无效则为模拟客户端）
export const supabase = isValidSupabaseConfig 
  ? createClient<Database>(finalUrl, finalKey)
  : null

// 客户端专用的 Supabase 实例
export const createClientComponentClient = () => {
  if (!isValidSupabaseConfig) {
    console.warn('Supabase 配置无效，使用模拟数据模式')
    return null
  }
  return createClient<Database>(finalUrl, finalKey)
}

// 导出配置状态
export const isSupabaseConfigured = isValidSupabaseConfig
