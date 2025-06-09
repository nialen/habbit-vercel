"use client"

import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function AuthDebug() {
  const { user, userProfile, loading, isAuthenticated } = useAuth()
  const [supabaseSession, setSupabaseSession] = useState<any>(null)
  const [localStorageInfo, setLocalStorageInfo] = useState<string[]>([])
  const [cookieInfo, setCookieInfo] = useState<string[]>([])

  useEffect(() => {
    const supabase = createClient()
    
    // 获取 Supabase 会话信息
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseSession(session)
    })

    // 检查 localStorage
    if (typeof window !== 'undefined') {
      const localKeys = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.includes('supabase') || key.includes('auth'))) {
          localKeys.push(`${key}: ${localStorage.getItem(key)?.substring(0, 50)}...`)
        }
      }
      setLocalStorageInfo(localKeys)

      // 检查 cookies
      const cookies = document.cookie.split(';').filter(cookie => 
        cookie.includes('supabase') || cookie.includes('auth') || cookie.includes('session')
      )
      setCookieInfo(cookies.map(c => c.trim()))
    }
  }, [user])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">🔍 认证调试信息</h3>
      
      <div className="space-y-2">
        <div>
          <strong>AuthProvider 状态:</strong>
          <div>loading: {loading ? '✅' : '❌'}</div>
          <div>isAuthenticated: {isAuthenticated ? '✅' : '❌'}</div>
          <div>user: {user ? `✅ ${user.email}` : '❌'}</div>
          <div>userProfile: {userProfile ? `✅ ${userProfile.name}` : '❌'}</div>
        </div>

        <div>
          <strong>Supabase 会话:</strong>
          <div>session: {supabaseSession ? '✅' : '❌'}</div>
          {supabaseSession && (
            <div>email: {supabaseSession.user?.email}</div>
          )}
        </div>

        <div>
          <strong>LocalStorage ({localStorageInfo.length}):</strong>
          {localStorageInfo.map((info, i) => (
            <div key={i} className="text-xs opacity-70">{info}</div>
          ))}
        </div>

        <div>
          <strong>Cookies ({cookieInfo.length}):</strong>
          {cookieInfo.map((cookie, i) => (
            <div key={i} className="text-xs opacity-70">{cookie.substring(0, 30)}...</div>
          ))}
        </div>
      </div>
    </div>
  )
} 