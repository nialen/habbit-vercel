"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AppContextType {
  habits: Habit[]
  setHabits: (habits: Habit[]) => void
  activities: Activity[]
  setActivities: (activities: Activity[]) => void
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

  useEffect(() => {
    // 初始化默认数据
    const defaultHabits: Habit[] = [
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

    setHabits(defaultHabits)
    setActivities(defaultActivities)
  }, [])

  return (
    <AppContext.Provider
      value={{
        habits,
        setHabits,
        activities,
        setActivities,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
