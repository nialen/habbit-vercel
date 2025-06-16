"use client"

import { useEffect, useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function AuthPageContent() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    
    // 检查URL中的错误参数
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
  }, [searchParams])

  // 监听认证状态变化，自动重定向已登录用户
  useEffect(() => {
    if (mounted && !loading && user) {
      console.log('用户已登录，重定向到首页')
      router.push('/')
      router.refresh() // 强制刷新页面状态
    }
  }, [mounted, loading, user, router])

  // 监听 Supabase Auth 状态变化
  useEffect(() => {
    if (!mounted) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, !!session?.user)
      
      if (event === 'SIGNED_IN' && session?.user) {
        setAuthLoading(true)
        setError(null) // 清除之前的错误
        // 稍微延迟一下，让 AuthProvider 有时间更新状态
        setTimeout(() => {
          router.push('/')
          router.refresh()
        }, 500)
      }
      
      if (event === 'SIGNED_OUT') {
        setAuthLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [mounted, router, supabase.auth])

  if (!mounted || loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {authLoading ? '登录成功，正在跳转...' : '正在加载...'}
          </p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // 将重定向到首页
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 顶部 Logo */}
      {/* <div className="pt-8 pb-4">
        <div className="flex justify-center items-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
        </div>
      </div> */}

      {/* 认证表单 */}
      <div className="max-w-md mx-auto px-4">
        {/* 错误提示 */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                欢迎来到星航成长营
              </h1>
              <p className="text-gray-600">
                请登录或注册开始您的亲子成长之旅
              </p>
            </div>

            <Auth
              supabaseClient={supabase}
              view="sign_in"
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#3b82f6',
                      brandAccent: '#2563eb',
                    },
                  },
                },
                className: {
                  anchor: 'text-blue-600 hover:text-blue-700 underline',
                  button: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors w-full',
                  input: 'block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  label: 'block text-sm font-medium text-gray-700 mb-1',
                  container: 'space-y-4',
                  divider: 'text-gray-400',
                  message: 'text-red-600 text-sm mt-2',
                },
              }}
              providers={['github', 'google']}
              redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined}
              socialLayout="vertical"
              showLinks={true}
              magicLink={false}
              onlyThirdPartyProviders={false}
              localization={{
                variables: {
                  sign_in: {
                    email_label: '邮箱地址',
                    password_label: '密码',
                    button_label: '登录',
                    loading_button_label: '登录中...',
                    social_provider_text: '使用 {{provider}} 登录',
                    link_text: '已有账户？点击登录',
                  },
                  sign_up: {
                    email_label: '邮箱地址',
                    password_label: '密码',
                    button_label: '注册',
                    loading_button_label: '注册中...',
                    social_provider_text: '使用 {{provider}} 注册',
                    link_text: '没有账户？点击注册',
                    confirmation_text: '请检查您的邮箱以确认账户',
                  },
                  forgotten_password: {
                    email_label: '邮箱地址',
                    button_label: '发送重置链接',
                    loading_button_label: '发送中...',
                    link_text: '忘记密码？',
                    confirmation_text: '请检查您的邮箱中的密码重置链接',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* 底部说明 */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            登录即表示您同意我们的
            <a href="#" className="text-blue-600 hover:text-blue-700 underline">服务条款</a>
            和
            <a href="#" className="text-blue-600 hover:text-blue-700 underline">隐私政策</a>
          </p>
        </div>
      </div>
    </div>
  )
}
