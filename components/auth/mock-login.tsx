"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, Mail, Lock, User, Baby, Github, Chrome } from "lucide-react"

interface MockLoginProps {
  onLogin: (user: MockUser) => void
}

interface MockUser {
  id: string
  email: string
  name: string
  child_name: string
  child_age: number
  avatar_url?: string
}

// 预设的模拟用户
const MOCK_USERS = [
  {
    id: "mock-user-1",
    email: "parent1@example.com",
    name: "张妈妈",
    child_name: "小明",
    child_age: 6,
    avatar_url: "/avatars/parent-1.svg"
  },
  {
    id: "mock-user-2", 
    email: "parent2@example.com",
    name: "李爸爸",
    child_name: "小红",
    child_age: 8,
    avatar_url: "/avatars/parent-2.svg"
  },
  {
    id: "mock-user-3",
    email: "parent3@example.com", 
    name: "王妈妈",
    child_name: "小刚",
    child_age: 5,
    avatar_url: "/avatars/parent-3.svg"
  }
]

export function MockLogin({ onLogin }: MockLoginProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    name: '',
    child_name: '',
    child_age: 5
  })

  const handleQuickLogin = async (user: MockUser) => {
    setIsLoading(true)
    setError(null)
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onLogin(user)
    setIsLoading(false)
  }

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // 模拟登录验证
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 检查是否为预设用户
    const existingUser = MOCK_USERS.find(user => user.email === loginForm.email)
    
    if (existingUser) {
      onLogin(existingUser)
    } else if (loginForm.email && loginForm.password) {
      // 创建新的模拟用户
      const newUser: MockUser = {
        id: `mock-user-${Date.now()}`,
        email: loginForm.email,
        name: loginForm.email.split('@')[0],
        child_name: "小宝贝",
        child_age: 6
      }
      onLogin(newUser)
    } else {
      setError('请输入邮箱和密码')
    }
    
    setIsLoading(false)
  }

  const handleFormSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // 模拟注册延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (signupForm.email && signupForm.password && signupForm.name && signupForm.child_name) {
      const newUser: MockUser = {
        id: `mock-user-${Date.now()}`,
        email: signupForm.email,
        name: signupForm.name,
        child_name: signupForm.child_name,
        child_age: signupForm.child_age
      }
      onLogin(newUser)
    } else {
      setError('请填写所有必填字段')
    }
    
    setIsLoading(false)
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    setError(null)
    
    // 模拟社交登录
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const socialUser: MockUser = {
      id: `mock-${provider}-${Date.now()}`,
      email: `user@${provider}.com`,
      name: `${provider}用户`,
      child_name: "小宝贝",
      child_age: 6,
      avatar_url: `/avatars/${provider}.svg`
    }
    
    onLogin(socialUser)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl mx-auto mb-4">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">星航成长营</h1>
          <p className="text-gray-600 mt-1">模拟登录 - 适用于演示环境</p>
        </div>

        {/* 快速登录选项 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">快速登录</CardTitle>
            <CardDescription>选择一个预设用户快速体验</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_USERS.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={() => handleQuickLogin(user)}
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">
                      {user.child_name}，{user.child_age}岁
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* 表单登录 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">自定义登录</CardTitle>
            <CardDescription>使用表单创建或登录账户</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">登录</TabsTrigger>
                <TabsTrigger value="signup">注册</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleFormLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">密码</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="输入任意密码"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? '登录中...' : '登录'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleFormSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">邮箱</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">密码</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="输入任意密码"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parent-name">家长姓名</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="parent-name"
                        placeholder="请输入您的姓名"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="child-name">孩子姓名</Label>
                    <div className="relative">
                      <Baby className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="child-name"
                        placeholder="请输入孩子的姓名"
                        value={signupForm.child_name}
                        onChange={(e) => setSignupForm({...signupForm, child_name: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="child-age">孩子年龄</Label>
                    <Input
                      id="child-age"
                      type="number"
                      min="3"
                      max="18"
                      value={signupForm.child_age}
                      onChange={(e) => setSignupForm({...signupForm, child_age: parseInt(e.target.value) || 5})}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? '注册中...' : '注册'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* 社交登录 */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">或者</span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('github')}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Google
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 错误提示 */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 说明 */}
        <div className="text-center text-sm text-gray-500">
          <p>这是一个模拟登录环境，所有数据都是虚拟的</p>
          <p>适用于演示和开发测试</p>
        </div>
      </div>
    </div>
  )
} 