import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"

interface FirstLoginState {
  isFirstLogin: boolean
  shouldShowSetup: boolean
  markSetupComplete: () => void
}

/**
 * 检测是否为首次登录的钩子
 * 判断条件：
 * 1. 用户已登录
 * 2. 用户资料存在但信息不完整（使用默认值）
 * 3. 或者用户资料中的关键字段为默认值
 */
export function useFirstLogin(): FirstLoginState {
  const { user, userProfile, loading } = useAuth()
  const [shouldShowSetup, setShouldShowSetup] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    // 避免重复检查和在加载状态下检查
    if (loading || hasChecked || !user) return

    // 检查用户资料是否需要完善
    const needsSetup = checkIfNeedsSetup(userProfile)
    
    console.log('🔍 首次登录检查:', {
      hasUser: !!user,
      hasProfile: !!userProfile,
      needsSetup,
      profileData: userProfile
    })

    setShouldShowSetup(needsSetup)
    setHasChecked(true)
  }, [user, userProfile, loading, hasChecked])

  const checkIfNeedsSetup = (profile: any): boolean => {
    if (!profile) {
      // 如果没有用户资料，说明需要设置
      return true
    }

    // 检查孩子信息是否为默认值或空值
    const hasDefaultChildName = !profile.child_name || profile.child_name.trim() === "" || profile.child_name === "小宝贝"
    const hasDefaultAge = !profile.child_age || profile.child_age === 5

    // 如果孩子信息使用默认值，则认为需要完善
    const needsSetup = hasDefaultChildName || hasDefaultAge
    
    // 添加详细日志以便调试
    console.log('🔍 用户资料检查详情:', {
      child_name: profile.child_name,
      child_age: profile.child_age,
      hasDefaultChildName,
      hasDefaultAge,
      needsSetup
    })
    
    return needsSetup
  }

  const markSetupComplete = () => {
    setShouldShowSetup(false)
  }

  const isFirstLogin = shouldShowSetup && !!user && !loading

  return {
    isFirstLogin,
    shouldShowSetup,
    markSetupComplete
  }
} 