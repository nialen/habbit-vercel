"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { Eye, EyeOff, Mail, Lock, User, Baby, Shield, CheckCircle, Github } from "lucide-react"

interface RegisterFormWithVerificationProps {
  onSwitchToLogin: () => void
}

type RegistrationStep = "email" | "verification" | "profile" | "success"

interface FormData {
  email: string
  verificationCode: string
  password: string
  confirmPassword: string
  name: string
  childName: string
  childAge: string
}

export function RegisterFormWithVerification({ onSwitchToLogin }: RegisterFormWithVerificationProps) {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("email")
  const [formData, setFormData] = useState<FormData>({
    email: "",
    verificationCode: "",
    password: "",
    confirmPassword: "",
    name: "",
    childName: "",
    childAge: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [verificationCodeSent, setVerificationCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const { signUp, signInWithGithub, signInWithGoogle } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // 发送验证码
  const sendVerificationCode = async () => {
    if (!formData.email) {
      setError("请输入邮箱地址")
      return
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("请输入有效的邮箱地址")
      return
    }

    if (!supabase) {
      setError("服务配置错误，请联系管理员")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log('开始发送验证码到:', formData.email)
      
      // 使用 Supabase 的 OTP 发送功能进行邮箱验证
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          shouldCreateUser: false, // 不自动创建用户，我们手动控制
          data: {
            purpose: 'email_verification', // 标记这是用于邮箱验证的OTP
          }
        }
      })

      if (error) {
        console.error('Supabase OTP 错误:', error)
        
        // 常见错误处理
        if (error.message.includes('rate') || error.message.includes('频繁')) {
          setError("验证码发送太频繁，请稍后再试")
        } else if (error.message.includes('User already registered')) {
          setError("此邮箱已注册，请直接登录")
        } else if (error.message.includes('Invalid email')) {
          setError("邮箱地址无效")
        } else {
          setError(`发送验证码失败: ${error.message}`)
        }
      } else {
        console.log('验证码发送成功')
        setVerificationCodeSent(true)
        setCurrentStep("verification")
        // 开始倒计时
        setCountdown(60)
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    } catch (err) {
      console.error('发送验证码错误:', err)
      
      // 详细错误信息
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError("网络连接失败，请检查网络连接或稍后重试")
      } else if (err instanceof Error) {
        setError(`发送验证码失败: ${err.message}`)
      } else {
        setError("发送验证码失败: 未知错误")
      }
    } finally {
      setLoading(false)
    }
  }

  // 验证邮箱验证码
  const verifyCode = async () => {
    if (!formData.verificationCode) {
      setError("请输入验证码")
      return
    }

    if (!supabase) {
      setError("服务配置错误，请联系管理员")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log('验证验证码:', formData.verificationCode)
      
      // 验证 OTP
      const { error } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: formData.verificationCode,
        type: 'email'
      })

      if (error) {
        console.error('验证码验证错误:', error)
        setError("验证码无效或已过期")
      } else {
        console.log('验证码验证成功')
        setCurrentStep("profile")
      }
    } catch (err) {
      console.error('验证码验证错误:', err)
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError("网络连接失败，请检查网络连接或稍后重试")
      } else if (err instanceof Error) {
        setError(`验证失败: ${err.message}`)
      } else {
        setError("验证失败: 未知错误")
      }
    } finally {
      setLoading(false)
    }
  }

  // 完成注册
  const completeRegistration = async () => {
    setLoading(true)
    setError("")

    // 验证密码
    if (formData.password !== formData.confirmPassword) {
      setError("密码确认不匹配")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("密码长度至少为6位")
      setLoading(false)
      return
    }

    // 进行注册
    const { error } = await signUp(formData.email, formData.password, {
      name: formData.name,
      child_name: formData.childName,
      child_age: Number.parseInt(formData.childAge) || 0,
    })

    if (error) {
      setError(error.message)
    } else {
      setCurrentStep("success")
    }

    setLoading(false)
  }

  // 重新发送验证码
  const resendCode = async () => {
    await sendVerificationCode()
  }

  const handleGithubSignup = async () => {
    setLoading(true)
    setError("")
    const { error } = await signInWithGithub()
    if (error) {
      setError(error.message)
      setLoading(false)
    }
    // 成功的话会重定向，不需要设置 loading = false
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    setError("")
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
      setLoading(false)
    }
    // 成功的话会重定向，不需要设置 loading = false
  }

  // 渲染邮箱输入步骤
  const renderEmailStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="text-white w-8 h-8" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">验证邮箱</CardTitle>
        <p className="text-gray-600">请输入您的邮箱地址，我们将发送验证码</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">邮箱地址</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="请输入您的邮箱"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

          <Button 
            onClick={sendVerificationCode} 
            className="w-full bg-purple-500 hover:bg-purple-600" 
            disabled={loading || !formData.email}
          >
            {loading ? "发送中..." : "发送验证码"}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">或使用社交账户注册</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleGithubSignup}
              disabled={loading}
              className="w-full"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
          </div>

          <div className="text-center">
            <button type="button" onClick={onSwitchToLogin} className="text-purple-500 hover:text-purple-600 text-sm">
              已有账户？立即登录
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // 渲染验证码输入步骤
  const renderVerificationStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="text-white w-8 h-8" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">输入验证码</CardTitle>
        <p className="text-gray-600">
          我们已向 <span className="font-medium text-gray-800">{formData.email}</span> 发送了6位验证码
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verificationCode">验证码</Label>
            <Input
              id="verificationCode"
              name="verificationCode"
              type="text"
              placeholder="请输入6位验证码"
              value={formData.verificationCode}
              onChange={handleChange}
              className="text-center text-lg font-mono tracking-widest"
              maxLength={6}
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

          <Button 
            onClick={verifyCode} 
            className="w-full bg-blue-500 hover:bg-blue-600" 
            disabled={loading || formData.verificationCode.length !== 6}
          >
            {loading ? "验证中..." : "验证"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            没收到验证码？
            {countdown > 0 ? (
              <span className="text-gray-400 ml-1">
                {countdown}秒后可重新发送
              </span>
            ) : (
              <button 
                onClick={resendCode} 
                className="text-blue-500 hover:text-blue-600 ml-1"
                disabled={loading}
              >
                重新发送
              </button>
            )}
          </div>

          <div className="text-center">
            <button 
              type="button" 
              onClick={() => setCurrentStep("email")} 
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← 修改邮箱
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // 渲染个人信息填写步骤
  const renderProfileStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-white w-8 h-8" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">完善信息</CardTitle>
        <p className="text-gray-600">邮箱验证成功！请完善您的注册信息</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">家长姓名</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="请输入您的姓名"
                value={formData.name}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="childName">孩子姓名</Label>
              <div className="relative">
                <Baby className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="childName"
                  name="childName"
                  type="text"
                  placeholder="孩子姓名"
                  value={formData.childName}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="childAge">孩子年龄</Label>
              <Input
                id="childAge"
                name="childAge"
                type="number"
                placeholder="年龄"
                value={formData.childAge}
                onChange={handleChange}
                min="1"
                max="18"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">设置密码</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="请输入密码（至少6位）"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认密码</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

          <Button 
            onClick={completeRegistration} 
            className="w-full bg-green-500 hover:bg-green-600" 
            disabled={loading}
          >
            {loading ? "注册中..." : "完成注册"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // 渲染成功步骤
  const renderSuccessStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-2xl">✓</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">注册成功！</h3>
        <p className="text-gray-600 mb-4">
          欢迎加入星航成长营！您的账户已成功创建
        </p>
        <Button onClick={onSwitchToLogin} className="bg-blue-500 hover:bg-blue-600">
          立即登录
        </Button>
      </CardContent>
    </Card>
  )

  // 根据当前步骤渲染对应的组件
  switch (currentStep) {
    case "email":
      return renderEmailStep()
    case "verification":
      return renderVerificationStep()
    case "profile":
      return renderProfileStep()
    case "success":
      return renderSuccessStep()
    default:
      return renderEmailStep()
  }
}
