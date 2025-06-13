"use client"

import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from "react"
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

const clearUserProfileCache = () => {
  safeLocalStorage.removeItem(CACHE_KEY)
  safeLocalStorage.removeItem(CACHE_EXPIRY_KEY)
  safeLocalStorage.removeItem(TOKEN_EXPIRY_KEY)
  safeLocalStorage.removeItem(LAST_AUTH_CHECK_KEY)
  safeLocalStorage.removeItem(INIT_FLAG_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const completeMode = useMemo(() => isCompleteMode(), [])
  
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

  const isAuthenticated = !!user
  
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

    // 🚀 新增：智能认证检查 - 在token有效期内直接跳过
    if (shouldSkipAuthCheck()) {
      console.log('✅ Token仍然有效且最近已检查过，跳过认证流程')
      const cachedProfile = getCachedUserProfile()
      if (cachedProfile) {
        console.log('✅ 使用缓存的用户资料，快速完成加载')
        setUserProfile(cachedProfile)
        setUser(prev => prev || {
          id: cachedProfile.id,
          email: cachedProfile.email,
          aud: 'authenticated',
          role: 'authenticated',
          created_at: cachedProfile.created_at,
          updated_at: cachedProfile.updated_at,
          app_metadata: {},
          user_metadata: {},
        } as User)
        setLoading(false)
        setInitialized(true)
        return
      }
    }
    
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
        // 用户退出登录
        console.log('User signed out, clearing profile...')
        setUserProfile(null)
        clearUserProfileCache()
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
    console.log('🔄 开始退出登录流程...')
    
    try {
      // 立即清除所有本地状态，确保UI立即响应
      setUser(null)
      setUserProfile(null)
      setError(null)
      setLoading(false)
      setInitialized(false)
      
      // 清除用户资料缓存
      clearUserProfileCache()
      
      // 清除所有浏览器存储
      if (typeof window !== 'undefined') {
        try {
          localStorage.clear()
          sessionStorage.clear()
          console.log('🧹 已清除所有浏览器存储')
        } catch (error) {
          console.warn('清除浏览器存储时出错:', error)
        }
      }
      
      if (isSupabaseConfigured && supabase) {
        // 执行Supabase退出登录（异步，但不等待结果）
        supabase.auth.signOut().then(({ error }) => {
          if (error) {
            console.error('❌ Supabase退出登录时发生错误:', error)
          } else {
            console.log('✅ Supabase退出登录成功')
          }
        }).catch((error) => {
          console.error('❌ Supabase退出登录异常:', error)
        })
      }
      
      console.log('🏁 退出登录流程结束，重定向到欢迎页面')
      
      // 确保在下一个事件循环中重定向，让状态更新完成
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      }, 100)
      
    } catch (error) {
      console.error('退出登录过程中发生未知错误:', error)
      
      // 确保无论如何都清除状态并重定向
      setUser(null)
      setUserProfile(null)
      setError(null)
      setLoading(false)
      setInitialized(false)
      
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
      
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      }, 100)
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
