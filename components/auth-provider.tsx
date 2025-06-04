"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { isDemoMode, isCompleteMode, isCompleteModeConfigured } from "@/lib/app-mode"

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<{ error: any }>
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
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const demoMode = isDemoMode()
  const completeMode = isCompleteMode()
  const isAuthenticated = demoMode ? true : !!user

  useEffect(() => {
    if (demoMode) {
      // 演示模式：自动使用模拟数据
      console.log('🎭 使用演示模式认证数据')
      setUserProfile(mockUserProfile)
      setUser({
        id: mockUserProfile.id,
        email: mockUserProfile.email,
        aud: 'authenticated',
        role: 'authenticated',
        created_at: mockUserProfile.created_at,
        updated_at: mockUserProfile.updated_at,
        app_metadata: {},
        user_metadata: {},
      } as User)
      setLoading(false)
      return
    }

    // 完整模式或默认模式：使用真实认证
    console.log('🔐 使用完整模式认证 - 需要登录')

    if (!isSupabaseConfigured || !supabase) {
      console.warn('⚠️ Supabase 未配置，显示登录页面')
      setLoading(false)
      return
    }

    // 获取初始会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [demoMode, completeMode])

  const fetchUserProfile = async (userId: string) => {
    if (!supabase) return

    try {
      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user profile:", error)
      } else if (data) {
        setUserProfile(data)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    } finally {
      setLoading(false)
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
        name: userData.name || "",
        child_name: userData.child_name || "",
        child_age: userData.child_age || 0,
      })

      if (profileError) {
        console.error("Error creating user profile:", profileError)
        return { error: profileError }
      }
    }

    return { error: null }
  }

  const signOut = async () => {
    if (demoMode) {
      // 演示模式：无需实际登出
      return
    }

    if (!isSupabaseConfigured || !supabase) {
      return
    }
    await supabase.auth.signOut()
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
        signIn,
        signUp,
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
