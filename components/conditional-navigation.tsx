"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { SimpleNavigation } from "./simple-navigation"

export function ConditionalNavigation() {
  const pathname = usePathname()
  const [shouldShowNavigation, setShouldShowNavigation] = useState(true)

  useEffect(() => {
    // 在认证相关页面不显示导航
    const hideNavigation = pathname.startsWith('/auth') || pathname === '/login'
    setShouldShowNavigation(!hideNavigation)
  }, [pathname])

  // 在服务端渲染时默认显示导航，客户端会根据路径调整
  if (!shouldShowNavigation) {
    return null
  }

  return <SimpleNavigation />
} 