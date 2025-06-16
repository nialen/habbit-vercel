/**
 * 应用环境和配置管理
 */

// 应用环境类型
export type AppEnvironment = 'development' | 'production'

/**
 * 获取当前应用环境
 */
export function getAppEnvironment(): AppEnvironment {
  return (process.env.NEXT_PUBLIC_APP_ENV as AppEnvironment) || 'development'
}

/**
 * 检查是否为开发环境
 */
export function isDevelopment(): boolean {
  return getAppEnvironment() === 'development'
}

/**
 * 检查是否为生产环境
 */
export function isProduction(): boolean {
  return getAppEnvironment() === 'production'
}

/**
 * 检查 Supabase 配置是否有效
 */
export function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return !!(
    supabaseUrl && 
    supabaseUrl !== '[YOUR_PRODUCTION_PROJECT].supabase.co' &&
    supabaseAnonKey && 
    supabaseAnonKey !== '[YOUR_PRODUCTION_ANON_KEY]'
  )
}

/**
 * 获取环境显示名称
 */
export function getEnvironmentName(): string {
  return isDevelopment() ? '开发环境' : '生产环境'
}

/**
 * 获取环境描述
 */
export function getEnvironmentDescription(): string {
  return isDevelopment() 
    ? '开发和测试环境，连接开发数据库'
    : '生产环境，连接生产数据库'
}

/**
 * 应用模式管理工具
 * 用于检测和控制应用运行在演示模式还是完整模式
 */

export type AppMode = 'demo' | 'complete'

/**
 * 获取当前应用模式
 */
export function getAppMode(): AppMode {
  const mode = process.env.NEXT_PUBLIC_APP_MODE as AppMode
  const result = mode === 'complete' ? 'complete' : 'demo' // 默认为演示模式
  return result
}

/**
 * 检查是否为演示模式
 */
export function isDemoMode(): boolean {
  return getAppMode() === 'demo'
}

/**
 * 检查是否为完整模式
 */
export function isCompleteMode(): boolean {
  return getAppMode() === 'complete'
}

/**
 * 检查完整模式下是否正确配置了 Supabase
 */
export function isCompleteModeConfigured(): boolean {
  if (!isCompleteMode()) return true // 演示模式不需要 Supabase

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return !!(
    supabaseUrl && 
    supabaseUrl !== 'your_supabase_project_url' &&
    supabaseAnonKey && 
    supabaseAnonKey !== 'your_supabase_anon_key'
  )
}

/**
 * 获取模式显示名称
 */
export function getModeName(): string {
  return isDemoMode() ? '演示模式' : '完整模式'
}

/**
 * 获取模式描述
 */
export function getModeDescription(): string {
  return isDemoMode() 
    ? '使用模拟数据，无需登录，适合体验功能'
    : '使用真实数据库，需要登录，数据持久化保存'
}
