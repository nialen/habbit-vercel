"use client"

import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase"
import { isDemoMode, isCompleteMode, isCompleteModeConfigured } from "@/lib/app-mode"

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
  isDemoMode: boolean
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

export function AuthProvider({ children }: { children: ReactNode }) {
  // 使用 useMemo 来稳定 demoMode 的值，避免每次渲染都重新计算
  const demoMode = useMemo(() => isDemoMode(), [])
  const completeMode = useMemo(() => isCompleteMode(), [])
  
  // 在演示模式下，直接初始化为非加载状态
  const [user, setUser] = useState<User | null>(() => demoMode ? {
    id: mockUserProfile.id,
    email: mockUserProfile.email,
    aud: 'authenticated',
    role: 'authenticated',
    created_at: mockUserProfile.created_at,
    updated_at: mockUserProfile.updated_at,
    app_metadata: {},
    user_metadata: {},
  } as User : null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => demoMode ? mockUserProfile : null)
  const [loading, setLoading] = useState(() => !demoMode) // 演示模式下不需要加载
  const [error, setError] = useState<Error | null>(null)

  const isAuthenticated = demoMode ? true : !!user
  
  // 创建 Supabase 客户端实例
  const supabase = createClient()

  useEffect(() => {
    console.log('🔄 AuthProvider useEffect 启动，模式:', { demoMode, completeMode })
    
    // 启动一个8秒的超时计时器，作为最终的保险
    const timeoutId = setTimeout(() => {
      // 检查useState的'loading'状态，避免在已完成加载后再次触发
      setLoading(currentLoadingState => {
        if (currentLoadingState) {
          console.warn('⏰ 认证过程超时（8秒），强制结束加载。这通常意味着Supabase连接有问题或网络缓慢。应用将显示为未登录状态。')
          // 不再设置错误，而是让应用回退到未登录状态
          // setError(new Error('认证超时，请刷新页面重试')) 
          return false // 强制结束加载
        }
        return currentLoadingState // 保持当前状态
      })
    }, 8000)

    if (demoMode) {
      console.log('🎭 演示模式已在初始化时设置，跳过异步认证')
      clearTimeout(timeoutId) // 清除超时，因为演示模式不需要认证
      return () => {
        clearTimeout(timeoutId)
      }
    }

    // 完整模式或默认模式：使用真实认证
    console.log('🔐 使用完整模式认证 - 需要登录')

    if (!isSupabaseConfigured || !supabase) {
      clearTimeout(timeoutId) // 清除超时
      console.warn('⚠️ Supabase 未配置，显示登录页面')
      setLoading(false)
      return
    }

    // 获取初始会话 - 增强版
    const initializeAuth = async () => {
      try {
        console.log('🔄 开始初始化认证...')
        setError(null)
        
        // 首先检查 localStorage 和 cookies 中的会话信息
        if (typeof window !== 'undefined') {
          const cookies = document.cookie
          console.log('🍪 当前 Cookies:', cookies.split(';').filter(c => c.includes('supabase')).length, '个 Supabase 相关')
        }
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ 获取会话错误:', error)
          setError(error instanceof Error ? error : new Error('获取会话时发生未知错误'))
          setLoading(false)
          return
        }
        
        console.log('🔍 初始会话检查:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          email: session?.user?.email,
          userId: session?.user?.id,
          expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'N/A'
        })
        
        // 如果有会话但过期了，尝试刷新
        if (session && session.expires_at && session.expires_at < Date.now() / 1000) {
          console.log('🔄 会话已过期，尝试刷新...')
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
          
          if (refreshError) {
            console.error('❌ 刷新会话失败:', refreshError)
            setUser(null)
            setLoading(false)
            return
          }
          
          if (refreshData.session) {
            console.log('✅ 会话刷新成功')
            setUser(refreshData.session.user)
            await fetchUserProfile(refreshData.session.user.id, refreshData.session.user)
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
        clearTimeout(timeoutId) // 无论成功或失败，都清除超时
      }
    }
    
    initializeAuth()

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, !!session?.user, session?.user?.email)
      
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
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeoutId) // 组件卸载时也清除超时
    }
  }, [])

  const fetchUserProfile = async (userId: string, userInfo?: User) => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      console.log('🔍 获取用户资料，用户ID:', userId)
      setError(null)
      
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
  }

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
      }
    } catch (error) {
      console.error("❌ 创建用户资料异常:", error)
      setError(error instanceof Error ? error : new Error('创建用户资料时发生异常'))
    }
  }

  const signIn = async (email: string, password: string) => {
    if (demoMode) {
      // 演示模式：模拟登录成功
      return { error: null }
    }

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
    if (demoMode) {
      // 演示模式：模拟注册成功
      return { error: null }
    }

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
      const { error: profileError } = await supabase.from("user_profiles").insert({
        id: data.user.id,
        email: data.user.email!,
        name: userData.name || "新用户",
        child_name: userData.child_name || "小宝贝",
        child_age: userData.child_age || 5,
      })

      if (profileError) {
        console.error("❌ 注册时创建用户资料错误:", {
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
          code: profileError.code
        })
        return { error: profileError }
      }
    }

    return { error: null }
  }

  const signInWithGithub = async () => {
    if (demoMode) {
      // 演示模式：模拟登录成功
      return { error: null }
    }

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
    if (demoMode) {
      // 演示模式：模拟登录成功
      return { error: null }
    }

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
    if (demoMode) {
      // 演示模式：清除模拟用户数据
      console.log('🎭 演示模式退出登录')
      setUser(null)
      setUserProfile(null)
      setLoading(false) // 确保在演示模式下也更新加载状态
      return
    }

    if (!isSupabaseConfigured || !supabase) {
      console.error('❌ Supabase未配置，无法退出')
      return
    }
    
    console.log('🔐 开始退出登录流程...')
    
    // 1. 立即更新UI状态，给用户即时反馈
    setUser(null)
    setUserProfile(null)
    setLoading(false) // 关键：立即结束加载状态

    try {
      // 2. 在后台执行Supabase的退出登录
      const { error } = await supabase.auth.signOut()
      if (error) {
        // 这个错误通常不影响用户体验，因为UI已经退出了，只需在控制台记录
        console.error('Supabase 后台退出登录错误:', error)
      } else {
        console.log('✅ Supabase会话已成功在后台清除')
      }
      
      // 3. 彻底清除本地存储，作为额外的保险措施
      if (typeof window !== 'undefined') {
        console.log('🧹 开始清除本地存储...')
        // 清除 Supabase 相关的存储
        Object.keys(localStorage).forEach(key => {
          if (key.includes('supabase')) {
            localStorage.removeItem(key)
          }
        })
        console.log('✅ 本地存储已清除')

        // 4. 可选：更积极地清除cookies（通常Supabase.signOut()会处理）
        // document.cookie.split(";").forEach(cookie => {
        //   const eqPos = cookie.indexOf("=")
        //   const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
        //   if (name.startsWith('sb-')) {
        //     document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
        //     document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        //   }
        // })
        // console.log('✅ Cookies已清除')
      }
    } catch (error) {
      console.error('退出登录过程中发生未知错误:', error)
    } finally {
      console.log('🏁 退出登录流程结束')
      // 确保loading最终为false，即使有错误发生
      setLoading(false)
    }
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return { error: new Error("No user logged in") }

    if (demoMode) {
      // 演示模式：模拟更新成功
      setUserProfile(prev => prev ? { ...prev, ...data } : null)
      return { error: null }
    }

    if (!isSupabaseConfigured || !supabase) {
      return { error: new Error('Supabase 未正确配置') }
    }

    const { error } = await supabase
      .from("user_profiles")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (!error) {
      await fetchUserProfile(user.id)
    }

    return { error }
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
        isDemoMode: demoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
