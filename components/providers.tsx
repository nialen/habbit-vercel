"use client"

import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from "react"
import { isDemoMode } from "@/lib/app-mode"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

interface AppContextType {
  habits: Habit[]
  setHabits: (habits: Habit[]) => void
  activities: Activity[]
  setActivities: (activities: Activity[]) => void
  loadingHabits: boolean
  refreshHabits: (userId?: string) => void
}

interface Habit {
  id: string
  name: string
  icon: string
  streak: number
  completedToday: boolean
  category: string
  createdAt: string
}

interface Activity {
  id: string
  title: string
  category: string
  difficulty: number
  duration: string
  description: string
  educationalValue: string
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within Providers")
  }
  return context
}

export function Providers({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loadingHabits, setLoadingHabits] = useState(false)
  
  const demoMode = useMemo(() => isDemoMode(), [])

  // 刷新习惯数据的函数
  const refreshHabits = useCallback(async (userId?: string) => {
    setLoadingHabits(true)
    
    try {
      if (demoMode) {
        // 演示模式：使用模拟习惯数据
        console.log('🎭 加载演示习惯数据')
        const demoHabits: Habit[] = [
          {
            id: "1",
            name: "早睡早起",
            icon: "🌙",
            streak: 5,
            completedToday: false,
            category: "健康",
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "刷牙洗脸",
            icon: "🦷",
            streak: 3,
            completedToday: true,
            category: "卫生",
            createdAt: new Date().toISOString(),
          },
          {
            id: "3",
            name: "整理玩具",
            icon: "🧸",
            streak: 2,
            completedToday: false,
            category: "整理",
            createdAt: new Date().toISOString(),
          },
          {
            id: "4",
            name: "阅读绘本",
            icon: "📚",
            streak: 7,
            completedToday: true,
            category: "学习",
            createdAt: new Date().toISOString(),
          },
          {
            id: "5",
            name: "喝水记录",
            icon: "💧",
            streak: 4,
            completedToday: false,
            category: "健康",
            createdAt: new Date().toISOString(),
          },
        ]
        setHabits(demoHabits)
      } else {
        // 完整模式：动态导入数据库函数以避免初始加载问题
        if (userId) {
          console.log('🔐 从数据库加载习惯数据')
          try {
            // 动态导入以避免服务端/客户端不一致问题
            const { getHabits } = await import("@/lib/database")
            const dbHabits = await getHabits(userId)
            // 转换数据库格式到前端格式
            const formattedHabits: Habit[] = dbHabits.map(habit => ({
              id: habit.id,
              name: habit.name,
              icon: habit.icon,
              streak: 0, // TODO: 计算连续天数
              completedToday: false, // TODO: 检查今日是否完成
              category: habit.category,
              createdAt: habit.created_at,
            }))
            setHabits(formattedHabits)
          } catch (error) {
            console.error('加载习惯数据失败:', error)
            setHabits([])
          }
        } else {
          // 未登录时显示空数据
          console.log('👤 用户未登录，显示空数据')
          setHabits([])
        }
      }
    } catch (error) {
      console.error('刷新习惯数据失败:', error)
      setHabits([])
    } finally {
      setLoadingHabits(false)
    }
  }, [demoMode])

  useEffect(() => {
    // 初始化活动数据（在任何模式下都可用）
    const defaultActivities: Activity[] = [
      {
        id: "1",
        title: "一起做手工",
        category: "学习",
        difficulty: 2,
        duration: "30-45分钟",
        description: "制作简单的纸艺作品，培养动手能力",
        educationalValue: "提高专注力和创造力",
      },
      {
        id: "2",
        title: "户外寻宝游戏",
        category: "运动",
        difficulty: 3,
        duration: "60分钟",
        description: "在公园或小区寻找指定物品",
        educationalValue: "锻炼观察力和体能",
      },
      {
        id: "3",
        title: "亲子烘焙",
        category: "生活",
        difficulty: 4,
        duration: "90分钟",
        description: "一起制作简单的饼干或蛋糕",
        educationalValue: "学习数学概念和培养耐心",
      },
      {
        id: "4",
        title: "科学小实验",
        category: "学习",
        difficulty: 3,
        duration: "45分钟",
        description: "进行安全有趣的科学小实验",
        educationalValue: "激发好奇心和探索精神",
      },
    ]

    setActivities(defaultActivities)
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AppContext.Provider
        value={{
          habits,
          setHabits,
          activities,
          setActivities,
          loadingHabits,
          refreshHabits,
        }}
      >
        {children}
        <Toaster />
      </AppContext.Provider>
    </ThemeProvider>
  )
}
