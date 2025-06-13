"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Baby, 
  Calendar, 
  Save,
  Sparkles
} from "lucide-react"

interface ProfileFormData {
  child_name: string
  child_age: number
}

interface ProfileSetupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSetupComplete?: () => void
}

export function ProfileSetupModal({ open, onOpenChange, onSetupComplete }: ProfileSetupModalProps) {
  const { user, userProfile, updateProfile } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState<ProfileFormData>({
    child_name: "",
    child_age: 5,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 当用户资料加载时，预填充表单
  useEffect(() => {
    if (userProfile) {
      setFormData({
        child_name: userProfile.child_name || "",
        child_age: userProfile.child_age || 5,
      })
    }
  }, [userProfile])

  const handleInputChange = (field: keyof ProfileFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "错误",
        description: "请先登录后再尝试更新资料",
        variant: "destructive",
      })
      return
    }

    // 基本验证
    if (!formData.child_name.trim()) {
      toast({
        title: "请填写完整信息",
        description: "孩子昵称不能为空",
        variant: "destructive",
      })
      return
    }

    if (formData.child_age < 1 || formData.child_age > 18) {
      toast({
        title: "请填写正确的年龄",
        description: "孩子年龄应在1-18岁之间",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 使用当前用户的name或email作为默认家长姓名
      const parentName = userProfile?.name || user.user_metadata?.name || user.email?.split('@')[0] || "家长"
      
      const updateData = {
        name: parentName,
        child_name: formData.child_name.trim(),
        child_age: formData.child_age,
      }
      
      const { error } = await updateProfile(updateData)
      
      if (error) {
        toast({
          title: "设置失败",
          description: error.message || "设置个人信息时发生错误",
          variant: "destructive",
        })
      } else {
        toast({
          title: "设置成功",
          description: `欢迎 ${formData.child_name} 加入星航成长营！让我们一起开始美好的成长之旅吧！`,
        })
        
        // 调用设置完成回调
        onSetupComplete?.()
        onOpenChange(false)
      }
    } catch (error) {
      toast({
        title: "设置失败",
        description: "设置个人信息时发生错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.child_name.trim().length > 0 && formData.child_age >= 1 && formData.child_age <= 18

  const getUserInitial = () => {
    return formData.child_name?.charAt(0) || "👋"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center">
          <div className="flex justify-center">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl font-semibold bg-indigo-100 text-indigo-600">
                {getUserInitial()}
              </AvatarFallback>
            </Avatar>
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            欢迎加入星航成长营！
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            请告诉我们孩子的昵称和年龄，开始美好的成长之旅
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* 头像预览 */}
          {/* <div className="flex justify-center">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl font-semibold bg-indigo-100 text-indigo-600">
                {getUserInitial()}
              </AvatarFallback>
            </Avatar>
          </div> */}

          {/* 表单字段 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="child_name" className="flex items-center gap-2">
                <Baby className="w-4 h-4" />
                孩子昵称
              </Label>
              <Input
                id="child_name"
                value={formData.child_name}
                onChange={(e) => handleInputChange("child_name", e.target.value)}
                placeholder="请输入孩子的昵称，如：小明、豆豆、宝贝..."
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
              />
              <p className="text-xs text-gray-500">
                请输入1-18岁之间的年龄
              </p>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-center">
            <Button 
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="w-full gap-2"
              size="lg"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "设置中..." : "开始成长之旅"}
            </Button>
          </div>
        </div>

        {/* 温馨提示 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            💡 这些信息将帮助我们为孩子提供个性化的成长计划
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
} 