"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface MockUser {
  id: string
  email: string
  name: string
  child_name: string
  child_age: number
  avatar_url?: string
}

interface MockAuthContextType {
  user: MockUser | null
  loading: boolean
  signIn: (user: MockUser) => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined)

interface MockAuthProviderProps {
  children: ReactNode
}

export function MockAuthProvider({ children }: MockAuthProviderProps) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [loading, setLoading] = useState(true)

  // 初始化时检查本地存储
  useEffect(() => {
    const savedUser = localStorage.getItem('mock-user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Failed to parse saved user:', error)
        localStorage.removeItem('mock-user')
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (userData: MockUser) => {
    setLoading(true)
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setUser(userData)
    localStorage.setItem('mock-user', JSON.stringify(userData))
    setLoading(false)
  }

  const signOut = async () => {
    setLoading(true)
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 300))
    
    setUser(null)
    localStorage.removeItem('mock-user')
    setLoading(false)
  }

  const value: MockAuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user
  }

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  )
}

export function useMockAuth() {
  const context = useContext(MockAuthContext)
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider')
  }
  return context
} 