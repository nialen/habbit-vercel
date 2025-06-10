"use client"

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
import { 
  Baby, 
  Mail, 
  Calendar, 
  Save, 
  Settings as SettingsIcon,
  Shield,
  Palette,
  Bell
} from "lucide-react"

interface ProfileFormData {
  child_name: string
  child_age: number
}

export default function SettingsPage() {
  const { user, userProfile, updateProfile, loading } = useAuth()
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
      formData.child_name !== (userProfile.child_name || "") ||
      formData.child_age !== (userProfile.child_age || 5)
    
    setHasChanges(hasDataChanged)
  }, [formData, userProfile])

  const handleInputChange = (field: keyof ProfileFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
      const parentName = userProfile?.name || user.user_metadata?.name || user.email?.split('@')[0] || "家长"
      
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
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">个人设置</h1>
            <p className="text-gray-600">管理孩子的个人信息</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主要设置内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 孩子信息卡片 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="w-5 h-5 text-indigo-500" />
                  孩子信息
                </CardTitle>
                <p className="text-sm text-gray-600">
                  更新孩子的基本信息
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 头像显示 */}
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="text-lg font-semibold bg-indigo-100 text-indigo-600">
                        {getUserInitial()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-800">{formData.child_name || "未设置昵称"}</h3>
                      <p className="text-sm text-gray-500">{formData.child_age}岁</p>
                    </div>
                  </div>

                  <Separator />

                  {/* 基本信息 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        家长邮箱
                      </Label>
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">
                        邮箱地址不可修改
                      </p>
                    </div> */}

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
                        onChange={(e) => handleInputChange("child_age", parseInt(e.target.value) || 5)}
                        placeholder="请输入孩子的年龄"
                        required
                        className="w-40"
                      />
                      <p className="text-xs text-gray-500">
                        请输入1-18岁之间的年龄
                      </p>
                    </div>
                  </div>

                  {/* 保存按钮 */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-gray-500">
                      {hasChanges && "您有未保存的更改"}
                    </div>
                    <Button 
                      type="submit" 
                      disabled={!hasChanges || isSubmitting}
                      className="gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {isSubmitting ? "保存中..." : "保存更改"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* 侧边栏信息 */}
          <div className="space-y-6">
            {/* 账户状态 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">账户状态</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">会员状态</span>
                  <Badge variant="secondary">免费用户</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">注册时间</span>
                  <span className="text-sm">
                    {userProfile?.created_at ? 
                      new Date(userProfile.created_at).toLocaleDateString() : 
                      "未知"
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">最后更新</span>
                  <span className="text-sm">
                    {userProfile?.updated_at ? 
                      new Date(userProfile.updated_at).toLocaleDateString() : 
                      "未知"
                    }
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