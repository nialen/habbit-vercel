"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { PageLayout } from "@/components/page-layout"
import { useFirstLogin } from "@/hooks/use-first-login"
import { Baby, Calendar, Save, SettingsIcon, RefreshCw } from "lucide-react"

interface ProfileFormData {
  child_name: string
  child_age: number
}

export default function SettingsPage() {
  const { user, userProfile, updateProfile, loading } = useAuth()
  const { resetSetupState } = useFirstLogin()
  const { toast } = useToast()
  const [formData, setFormData] = useState<ProfileFormData>({
    child_name: "",
    child_age: 5,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // 当用户资料加载时，填充表单
  useEffect(() => {
    if (userProfile) {
      setFormData({
        child_name: userProfile.child_name || "",
        child_age: userProfile.child_age || 5,
      })
    }
  }, [userProfile])

  // 检测表单变化
  useEffect(() => {
    if (!userProfile) return

    const hasDataChanged =
      formData.child_name !== (userProfile.child_name || "") || formData.child_age !== (userProfile.child_age || 5)

    setHasChanges(hasDataChanged)
  }, [formData, userProfile])

  const handleInputChange = (field: keyof ProfileFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "错误",
        description: "请先登录后再尝试更新资料",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 保留原有的家长姓名，只更新孩子信息
      const parentName = userProfile?.name || user.user_metadata?.name || user.email?.split("@")[0] || "家长"

      const updateData = {
        name: parentName,
        child_name: formData.child_name.trim(),
        child_age: formData.child_age,
      }

      const { error } = await updateProfile(updateData)

      if (error) {
        toast({
          title: "更新失败",
          description: error.message || "更新用户资料时发生错误",
          variant: "destructive",
        })
      } else {
        toast({
          title: "更新成功",
          description: "孩子的信息已成功更新",
        })
        setHasChanges(false)
      }
    } catch (error) {
      toast({
        title: "更新失败",
        description: "更新用户资料时发生错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetFirstLogin = () => {
    resetSetupState?.()
    toast({
      title: "重置成功",
      description: "首次设置状态已重置，刷新页面后将重新显示设置弹窗",
    })
  }

  const getUserInitial = () => {
    return formData.child_name?.charAt(0) || userProfile?.child_name?.charAt(0) || "用"
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout variant="modern">
      <div className="container py-6">
        {/* 页面标题 */}
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-secondary p-3">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h1 className="font-semibold text-2xl">个人设置</h1>
            <p className="text-sm text-muted-foreground">管理孩子的个人信息</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* 主要设置内容 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 孩子信息卡片 */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="w-4 h-4 text-indigo-500" />
                  孩子信息
                </CardTitle>
                <p className="text-sm text-muted-foreground">更新孩子的基本信息</p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* 头像显示 */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-lg font-semibold bg-indigo-100 text-indigo-600">
                        {getUserInitial()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-800">{formData.child_name || "未设置昵称"}</h3>
                      <p className="text-sm text-muted-foreground">{formData.child_age}岁</p>
                    </div>
                  </div>

                  <Separator />

                  {/* 基本信息 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="child_name" className="flex items-center gap-2">
                        <Baby className="w-4 h-4" />
                        孩子昵称
                      </Label>
                      <Input
                        id="child_name"
                        value={formData.child_name}
                        onChange={(e) => handleInputChange("child_name", e.target.value)}
                        placeholder="请输入孩子的昵称"
                        required
                        className="input-modern"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="child_age" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        孩子年龄
                      </Label>
                      <Input
                        id="child_age"
                        type="number"
                        min="1"
                        max="18"
                        value={formData.child_age}
                        onChange={(e) => handleInputChange("child_age", Number.parseInt(e.target.value) || 5)}
                        placeholder="请输入孩子的年龄"
                        required
                        className="input-modern"
                      />
                      <p className="text-xs text-muted-foreground">请输入1-18岁之间的年龄</p>
                    </div>
                  </div>

                  {/* 提交按钮 */}
                  <div className="flex gap-3">
                    <Button type="submit" disabled={!hasChanges || isSubmitting} className="gap-2 btn-primary">
                      <Save className="w-4 h-4" />
                      {isSubmitting ? "更新中..." : "保存更改"}
                    </Button>

                    {/* 开发工具 */}
                    {process.env.NODE_ENV === "development" && (
                      <Button type="button" variant="outline" onClick={handleResetFirstLogin} className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        重置首次设置
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* 侧边栏信息 */}
          <div className="space-y-4">
            {/* 账户状态 */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-lg">账户状态</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">会员状态</span>
                  <Badge variant="secondary">免费用户</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">注册时间</span>
                  <span className="text-sm">
                    {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : "未知"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">最后更新</span>
                  <span className="text-sm">
                    {userProfile?.updated_at ? new Date(userProfile.updated_at).toLocaleDateString() : "未知"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
