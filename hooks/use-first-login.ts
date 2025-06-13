import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"

interface FirstLoginState {
  isFirstLogin: boolean
  shouldShowSetup: boolean
  markSetupComplete: () => void
  resetSetupState?: () => void // 仅用于开发/调试
}

/**
 * 检测是否为首次登录的钩子
 * 判断条件：
 * 1. 用户已登录
 * 2. 用户资料存在但信息不完整（使用默认值）
 * 3. 用户未完成过首次设置（通过 localStorage 记录）
 */
export function useFirstLogin(): FirstLoginState {
  const { user, userProfile, loading } = useAuth()
  const [shouldShowSetup, setShouldShowSetup] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    // 避免重复检查和在加载状态下检查
    if (loading || hasChecked || !user) return

    // 检查用户是否已经完成过首次设置
    const hasCompletedSetup = checkIfHasCompletedSetup(user.id)
    
    // 检查用户资料是否需要完善
    const needsSetup = !hasCompletedSetup && checkIfNeedsSetup(userProfile)
    
    console.log('🔍 首次登录检查:', {
      hasUser: !!user,
      hasProfile: !!userProfile,
      hasCompletedSetup,
      needsSetup,
      profileData: userProfile
    })

    setShouldShowSetup(needsSetup)
    setHasChecked(true)
  }, [user, userProfile, loading, hasChecked])

  const checkIfHasCompletedSetup = (userId: string): boolean => {
    if (typeof window === 'undefined') return false
    
    const storageKey = `profile_setup_completed_${userId}`
    const completed = localStorage.getItem(storageKey)
    return completed === 'true'
  }

  const checkIfNeedsSetup = (profile: any): boolean => {
    if (!profile) {
      // 如果没有用户资料，说明需要设置
      return true
    }

    // 检查孩子信息是否为默认值或空值
    // 更严格的检查：只有当 child_name 真的是默认值时才提示设置
    const hasDefaultChildName = 
      !profile.child_name || 
      profile.child_name.trim() === "" || 
      profile.child_name === "小宝贝"
    
    // 年龄检查：只有当年龄是明显的默认值时才提示
    const hasDefaultAge = profile.child_age === 5

    // 更宽松的判断：只有当孩子昵称是默认值时才认为需要设置
    // 这样避免了用户真的取名叫"小宝贝"或者孩子真的是5岁的情况下被误判
    const needsSetup = hasDefaultChildName
    
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
    
    // 在 localStorage 中记录用户已完成首次设置
    if (typeof window !== 'undefined' && user) {
      const storageKey = `profile_setup_completed_${user.id}`
      localStorage.setItem(storageKey, 'true')
      console.log('✅ 标记首次设置已完成:', storageKey)
    }
  }

  // 开发/调试用：重置设置状态
  const resetSetupState = () => {
    if (typeof window !== 'undefined' && user) {
      const storageKey = `profile_setup_completed_${user.id}`
      localStorage.removeItem(storageKey)
      setHasChecked(false)
      console.log('🔄 重置首次设置状态:', storageKey)
    }
  }

  const isFirstLogin = shouldShowSetup && !!user && !loading

  return {
    isFirstLogin,
    shouldShowSetup,
    markSetupComplete,
    resetSetupState
  }
} 