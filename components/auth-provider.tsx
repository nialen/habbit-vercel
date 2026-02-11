"use client"

import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase"
import { isCompleteMode, isCompleteModeConfigured } from "@/lib/app-mode"
import { safeLocalStorage } from "@/lib/safe-storage"

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  error: Error | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<{ error: any }>
  signInWithGithub: () => Promise<{ error: any }>
  signInWithGoogle: () => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: any }>
  isAuthenticated: boolean
}

interface UserProfile {
  id: string
  email: string
  name: string
  child_name: string
  child_age: number
  avatar_url?: string
  created_at: string
  updated_at: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

// 模拟用户数据（演示模式使用）
const mockUserProfile: UserProfile = {
  id: "mock-user-123",
  email: "demo@example.com",
  name: "小明妈妈",
  child_name: "小明",
  child_age: 6,
  avatar_url: "/avatars/parent-1.svg",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// 缓存相关常量
const CACHE_KEY = 'auth_user_profile'
const CACHE_EXPIRY_KEY = 'auth_user_profile_expiry'
const TOKEN_EXPIRY_KEY = 'auth_token_expiry'
const LAST_AUTH_CHECK_KEY = 'auth_last_check'
const CACHE_DURATION = 10 * 60 * 1000 // 10分钟缓存
const INIT_FLAG_KEY = 'auth_initialized'

// 缓存工具函数
const cacheUserProfile = (profile: UserProfile) => {
  safeLocalStorage.setItem(CACHE_KEY, JSON.stringify(profile))
  safeLocalStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString())
}

const getCachedUserProfile = (): UserProfile | null => {
  try {
    const expiry = safeLocalStorage.getItem(CACHE_EXPIRY_KEY)
    if (!expiry || Date.now() > parseInt(expiry)) {
      // 缓存过期，清除
      safeLocalStorage.removeItem(CACHE_KEY)
      safeLocalStorage.removeItem(CACHE_EXPIRY_KEY)
      return null
    }
    const cached = safeLocalStorage.getItem(CACHE_KEY)
    return cached ? JSON.parse(cached) : null
  } catch (error) {
    console.warn('无法读取缓存的用户资料:', error)
    return null
  }
}

// 新增：Token有效性检查函数
const cacheTokenExpiry = (expiresAt: number) => {
  safeLocalStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt.toString())
  safeLocalStorage.setItem(LAST_AUTH_CHECK_KEY, Date.now().toString())
}

const isTokenValid = (): boolean => {
  if (typeof window === 'undefined') return false
  try {
    const tokenExpiry = safeLocalStorage.getItem(TOKEN_EXPIRY_KEY)
    if (!tokenExpiry) return false
    
    const expiryTime = parseInt(tokenExpiry) * 1000 // 转换为毫秒
    const now = Date.now()
    const isValid = now < expiryTime - 60000 // 提前1分钟判断过期，留有余量
    
    console.log('🔍 Token有效性检查:', {
      expiryTime: new Date(expiryTime).toLocaleString(),
      currentTime: new Date(now).toLocaleString(),
      isValid,
      remainingMinutes: Math.floor((expiryTime - now) / 60000)
    })
    
    return isValid
  } catch (error) {
    console.warn('无法检查token有效性:', error)
    return false
  }
}

const shouldSkipAuthCheck = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const lastCheck = safeLocalStorage.getItem(LAST_AUTH_CHECK_KEY)
  const tokenValid = isTokenValid()
  
  if (!tokenValid) {
    console.log('⚠️ Token已过期或无效，需要重新认证')
    return false
  }
  
  if (!lastCheck) {
    console.log('🔍 首次检查，需要验证认证状态')
    return false
  }
  
  const timeSinceLastCheck = Date.now() - parseInt(lastCheck)
  const shouldSkip = timeSinceLastCheck < 30000 // 30秒内不重复检查
  
  console.log('🔍 认证检查策略:', {
    tokenValid,
    timeSinceLastCheck: Math.floor(timeSinceLastCheck / 1000) + '秒',
    shouldSkip
  })
  
  return shouldSkip
}

// 清除所有认证相关的 cookies
const clearAuthCookies = () => {
  if (typeof window === 'undefined') return
  
  try {
    console.log('🍪 清除所有认证相关的 cookies...')
    
    // 定义需要清除的 cookie 名称
    const cookiesToClear = [
      'sb-access-token',
      'sb-refresh-token',
      'sb-auth-token',
      'supabase-auth-token',
      'supabase.auth.token',
      // Supabase 默认的 cookie 名称格式
      `sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF || 'localhost'}-auth-token`,
      `sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF || 'localhost'}-auth-token.0`,
      `sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF || 'localhost'}-auth-token.1`,
    ]
    
    // 获取所有现有的 cookies
    const allCookies = document.cookie.split(';')
    
    // 清除预定义的 cookies
    cookiesToClear.forEach(cookieName => {
      clearCookie(cookieName)
    })
    
    // 清除所有以认证相关前缀开头的 cookies
    allCookies.forEach(cookie => {
      const cookieName = cookie.trim().split('=')[0]
      if (cookieName.startsWith('sb-') || 
          cookieName.includes('auth') || 
          cookieName.includes('supabase') ||
          cookieName.includes('session')) {
        clearCookie(cookieName)
      }
    })
    
    console.log('✅ 已清除所有认证相关的 cookies')
  } catch (error) {
    console.warn('清除 cookies 时出错:', error)
  }
}

// 清除指定名称的 cookie（多种路径和域名）
const clearCookie = (cookieName: string) => {
  if (typeof window === 'undefined') return
  
  try {
    // 清除当前域名和路径的 cookie
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    
    // 清除根域名的 cookie
    if (window.location.hostname.includes('.')) {
      const rootDomain = '.' + window.location.hostname.split('.').slice(-2).join('.')
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${rootDomain};`
    }
    
    // 清除不同路径的 cookie
    const paths = ['/', '/auth', '/api']
    paths.forEach(path => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${window.location.hostname};`
      if (window.location.hostname.includes('.')) {
        const rootDomain = '.' + window.location.hostname.split('.').slice(-2).join('.')
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${rootDomain};`
      }
    })
  } catch (error) {
    console.warn(`清除 cookie ${cookieName} 时出错:`, error)
  }
}

const clearUserProfileCache = () => {
  console.log('🧹 清除所有认证相关缓存...')
  safeLocalStorage.removeItem(CACHE_KEY)
  safeLocalStorage.removeItem(CACHE_EXPIRY_KEY)
  safeLocalStorage.removeItem(TOKEN_EXPIRY_KEY)
  safeLocalStorage.removeItem(LAST_AUTH_CHECK_KEY)
  safeLocalStorage.removeItem(INIT_FLAG_KEY)
  
  // 清除所有可能的认证相关存储项
  const keysToRemove = [
    'supabase.auth.token',
    'sb-',
    'auth_user_profile',
    'auth_user_profile_expiry',
    'auth_token_expiry',
    'auth_last_check',
    'auth_initialized'
  ]
  
  keysToRemove.forEach(key => {
    if (key.endsWith('-')) {
      // 清除以特定前缀开头的所有键
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          Object.keys(localStorage).forEach(storageKey => {
            if (storageKey.startsWith(key)) {
              safeLocalStorage.removeItem(storageKey)
            }
          })
        }
      } catch (error) {
        console.warn('清除前缀缓存时出错:', error)
      }
    } else {
      safeLocalStorage.removeItem(key)
    }
  })
  
  // 同时清除 cookies
  clearAuthCookies()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const completeMode = useMemo(() => isCompleteMode(), [])
  const router = useRouter()
  
  // 优化：首先尝试从缓存加载用户资料
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    // 在服务器端不访问localStorage
    if (typeof window === 'undefined') return null
    return getCachedUserProfile()
  })
  
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [initialized, setInitialized] = useState(false)

  // 修复：完整的认证状态应该同时检查用户和用户资料
  const isAuthenticated = !!user && !!userProfile
  
  // 创建 Supabase 客户端实例
  const supabase = createClient()

  // 优化的用户资料获取函数
  const fetchUserProfile = useCallback(async (userId: string, userInfo?: User, skipCache = false) => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      console.log('🔍 获取用户资料，用户ID:', userId)
      setError(null)
      
      // 如果不跳过缓存且有缓存，直接使用缓存
      if (!skipCache) {
        const cached = getCachedUserProfile()
        if (cached && cached.id === userId) {
          console.log('✅ 使用缓存的用户资料:', cached.email)
          setUserProfile(cached)
          setLoading(false)
          return
        }
      }
      
      // 首先检查当前用户会话
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      console.log('🔍 当前认证用户:', {
        hasUser: !!currentUser,
        userId: currentUser?.id,
        email: currentUser?.email,
        userError: userError
      })
      
      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

      if (error) {
        if (error.code === "PGRST116") {
          console.log('📝 用户资料不存在，需要创建...')
          // 用户资料不存在，创建一个基本的用户资料
          await createUserProfile(userId, userInfo)
        } else {
          console.error("❌ 获取用户资料错误:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          setError(error instanceof Error ? error : new Error('获取用户资料时发生异常'))
        }
      } else if (data) {
        console.log('✅ 成功获取用户资料:', data.email)
        setUserProfile(data)
        // 缓存用户资料
        cacheUserProfile(data)
      }
    } catch (error) {
      console.error("❌ 获取用户资料异常:", {
        error: error,
        message: error instanceof Error ? error.message : '未知错误',
        stack: error instanceof Error ? error.stack : undefined,
        userId: userId
      })
      setError(error instanceof Error ? error : new Error('获取用户资料时发生异常'))
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const createUserProfile = async (userId: string, userInfo?: User) => {
    if (!supabase) return

    try {
      // 优先使用传入的用户信息，否则尝试获取当前用户
      let user: User | undefined | null = userInfo
      if (!user) {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        user = currentUser
      }
      
      if (!user) {
        console.error('❌ 无法获取用户信息来创建资料')
        return
      }

      console.log('📝 创建用户资料:', {
        id: userId,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '新用户'
      })

      const newProfile = {
        id: userId,
        email: user.email!,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '新用户',
        child_name: '小宝贝', // 确保有值，符合 NOT NULL 约束
        child_age: 5, // 确保有值，符合 NOT NULL 约束
        avatar_url: user.user_metadata?.avatar_url || null
      }

      const { data, error } = await supabase.from("user_profiles").insert(newProfile).select().single()

      if (error) {
        console.error("❌ 创建用户资料错误:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          fullError: error
        })
        console.error("❌ 尝试插入的数据:", newProfile)
        setError(error instanceof Error ? error : new Error('创建用户资料时发生异常'))
      } else {
        console.log('✅ 成功创建用户资料:', data)
        setUserProfile(data)
        // 缓存新创建的用户资料
        cacheUserProfile(data)
      }
    } catch (error) {
      console.error("❌ 创建用户资料异常:", error)
      setError(error instanceof Error ? error : new Error('创建用户资料时发生异常'))
    }
  }

  useEffect(() => {
    // 防止重复初始化
    if (initialized) {
      console.log('🔄 AuthProvider 已初始化，跳过重复初始化')
      return
    }

    console.log('🔄 AuthProvider useEffect 启动，模式:', { completeMode })

    // 暂时禁用智能认证检查，确保始终通过正常的Supabase认证流程
    // 这可以避免因为模拟User对象导致的认证状态不一致问题
    
    // 缩短超时时间到3秒，提升用户体验
    const timeoutId = setTimeout(() => {
      setLoading(currentLoadingState => {
        if (currentLoadingState) {
          console.warn('⏰ 认证过程超时（3秒），强制结束加载。应用将显示为未登录状态。')
          return false // 强制结束加载
        }
        return currentLoadingState
      })
    }, 3000) // 从8秒减少到3秒

    // 完整模式或默认模式：使用真实认证
    console.log('🔐 使用完整模式认证 - 需要登录')

    if (!isSupabaseConfigured || !supabase) {
      clearTimeout(timeoutId)
      console.warn('⚠️ Supabase 未配置，显示登录页面')
      setLoading(false)
      setInitialized(true)
      return
    }

    // 获取初始会话 - 增强版
    const initializeAuth = async () => {
      try {
        console.log('🔄 开始初始化认证...')
        setError(null)
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ 获取会话错误:', error)
          setError(error instanceof Error ? error : new Error('获取会话时发生未知错误'))
          setLoading(false)
          setInitialized(true)
          return
        }
        
        console.log('🔍 初始会话检查:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          email: session?.user?.email,
          userId: session?.user?.id,
          expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'N/A'
        })
        
        // 🚀 新增：缓存token过期时间
        if (session?.expires_at) {
          cacheTokenExpiry(session.expires_at)
        }
        
        // 如果有会话但过期了，尝试刷新
        if (session && session.expires_at && session.expires_at < Date.now() / 1000) {
          console.log('🔄 会话已过期，尝试刷新...')
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
          
          if (refreshError) {
            console.error('❌ 刷新会话失败:', refreshError)
            setUser(null)
            clearUserProfileCache()
            setLoading(false)
            setInitialized(true)
            return
          }
          
          if (refreshData.session) {
            console.log('✅ 会话刷新成功')
            // 缓存新的token过期时间
            if (refreshData.session.expires_at) {
              cacheTokenExpiry(refreshData.session.expires_at)
            }
            setUser(refreshData.session.user)
            await fetchUserProfile(refreshData.session.user.id, refreshData.session.user)
            setInitialized(true)
            return
          }
        }
        
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('👤 发现有效会话，获取用户资料...')
          await fetchUserProfile(session.user.id, session.user)
        } else {
          console.log('❌ 没有有效会话')
          setLoading(false)
        }
      } catch (error) {
        console.error('❌ 初始化认证失败:', error)
        setError(error instanceof Error ? error : new Error('认证初始化时发生未知错误'))
        setLoading(false)
      } finally {
        clearTimeout(timeoutId)
        setInitialized(true)
      }
    }
    
    initializeAuth()

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, !!session?.user, session?.user?.email)
      
      // 如果是退出登录事件，确保彻底清除状态
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing all state...')
        setUser(null)
        setUserProfile(null)
        clearUserProfileCache()
        setLoading(false)
        return
      }
      
      // 🚀 新增：更新token过期时间缓存
      if (session?.expires_at) {
        cacheTokenExpiry(session.expires_at)
      }
      
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // 用户登录成功
        if (event === 'SIGNED_IN') {
          console.log('User signed in, fetching profile...')
        }
        await fetchUserProfile(session.user.id, session.user)
      } else {
        // 其他情况下的无会话状态
        console.log('No session, clearing profile...')
        setUserProfile(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeoutId)
    }
  }, [initialized, completeMode, supabase, fetchUserProfile]) // 添加 initialized 依赖

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: new Error('数据库连接未配置，请联系管理员') }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: new Error('数据库连接未配置，请联系管理员') }
    }

    // 由于邮箱验证已经在组件中完成，这里直接进行用户注册
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // 不需要邮箱确认链接，因为已经通过OTP验证
      }
    })

    if (error) return { error }

    // 创建用户资料
    if (data.user) {
      const newProfile = {
        id: data.user.id,
        email: data.user.email!,
        name: userData.name || "新用户",
        child_name: userData.child_name || "小宝贝",
        child_age: userData.child_age || 5,
      }

      const { error: profileError } = await supabase.from("user_profiles").insert(newProfile)

      if (profileError) {
        console.error("❌ 注册时创建用户资料错误:", {
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
          code: profileError.code
        })
        return { error: profileError }
      }
      
      // 缓存新创建的用户资料
      const profileWithTimestamps = {
        ...newProfile,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      cacheUserProfile(profileWithTimestamps)
    }

    return { error: null }
  }

  const signInWithGithub = async () => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: new Error('数据库连接未配置，请联系管理员') }
    }

    console.log('🔄 启动 GitHub OAuth 流程...')
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent' // 强制显示授权页面
        },
        skipBrowserRedirect: false // 确保在当前窗口中重定向
      }
    })
    
    if (error) {
      console.error('GitHub OAuth 错误:', error)
    } else if (data?.url) {
      console.log('跳转到 GitHub 授权页面:', data.url)
      // 强制在当前窗口打开授权页面
      window.location.href = data.url
    }
    
    return { error }
  }

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: new Error('数据库连接未配置，请联系管理员') }
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })
    return { error }
  }

  const signOut = async () => {
    console.log('🚀 步骤1: 开始退出登录流程')
    const startTime = Date.now()
    
    try {
      // 1. 立即清除所有本地状态
      console.log('🚀 步骤2: 清除React状态')
      setUser(null)
      setUserProfile(null)
      setError(null)
      setLoading(false)
      console.log('✅ 步骤2完成: React状态已清除')
      
      // 2. 清除所有缓存和存储
      if (typeof window !== 'undefined') {
        console.log('🚀 步骤3: 开始清除浏览器存储')
        
        // 清除 localStorage 和 sessionStorage
        console.log('🚀 步骤3a: 清除localStorage和sessionStorage')
        localStorage.clear()
        sessionStorage.clear()
        console.log('✅ 步骤3a完成: localStorage和sessionStorage已清除')
        
        // 清除所有 cookies
        console.log('🚀 步骤3b: 清除cookies')
        const cookiesBefore = document.cookie.split(";").length
        document.cookie.split(";").forEach(cookie => {
          const eqPos = cookie.indexOf("=")
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
          if (name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
            if (window.location.hostname.includes('.')) {
              const domain = '.' + window.location.hostname.split('.').slice(-2).join('.')
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain}`
            }
          }
        })
        const cookiesAfter = document.cookie.split(";").length
        console.log(`✅ 步骤3b完成: cookies已清除 (${cookiesBefore} -> ${cookiesAfter})`)
        console.log('✅ 步骤3完成: 所有浏览器存储已清除')
      }
      
      // 3. 调用 Supabase 退出登录（不等待结果）
      console.log('🚀 步骤4: 调用Supabase退出登录（异步）')
      if (isSupabaseConfigured && supabase) {
        supabase.auth.signOut()
          .then(() => console.log('✅ Supabase退出登录成功'))
          .catch(err => console.log('❌ Supabase退出登录错误:', err))
      } else {
        console.log('⚠️ Supabase未配置，跳过')
      }
      console.log('✅ 步骤4完成: Supabase退出登录已启动')
      
      const endTime = Date.now()
      console.log(`⏱️ 退出登录准备完成，耗时: ${endTime - startTime}ms`)
      
      // 4. 使用 Next.js 路由跳转到首页（无刷新）
      console.log('🚀 步骤5: 开始页面跳转（无刷新）')
      console.log('当前路径:', window.location.pathname)
      console.log('目标路径: /')
      
      router.push('/')
      
      // 这行代码通常不会执行，因为页面已经跳转
      console.log('✅ 步骤5完成: 页面跳转命令已执行')
      
    } catch (error) {
      console.error('❌ 退出登录过程中发生错误:', error)
      console.error('错误堆栈:', error instanceof Error ? error.stack : '未知错误')
      
      // 即使出错也要强制跳转
      console.log('🚀 错误处理: 强制跳转到首页（无刷新）')
      router.push('/')
    }
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return { error: new Error("No user logged in") }

    try {
      console.log('🔄 更新用户资料...', { userId: user.id, data })
      
      // 调用API路由更新用户资料
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...data,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('❌ 更新用户资料失败:', result.error)
        return { error: new Error(result.error || '更新用户资料失败') }
      }

      console.log('✅ 用户资料更新成功:', result.userProfile)
      
      // 更新本地状态
      setUserProfile(result.userProfile)
      cacheUserProfile(result.userProfile)
      
      return { error: null }
    } catch (error) {
      console.error('❌ 更新用户资料时发生错误:', error)
      return { error: error instanceof Error ? error : new Error('更新用户资料时发生未知错误') }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        signIn,
        signUp,
        signInWithGithub,
        signInWithGoogle,
        signOut,
        updateProfile,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
