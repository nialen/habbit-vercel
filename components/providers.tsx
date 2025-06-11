"use client"

import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from "react"
import { isDemoMode } from "@/lib/app-mode"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { useAuth } from "@/components/auth-provider"

interface AppContextType {
  habits: Habit[]
  setHabits: (habits: Habit[]) => void
  activities: Activity[]
  setActivities: (activities: Activity[]) => void
  loadingHabits: boolean
  refreshHabits: (userId?: string) => void
  toggleHabit: (habitId: string, userId: string) => Promise<void>
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'completedToday'>, userId: string) => Promise<void>
  deleteHabit: (habitId: string) => Promise<void>
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
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
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
    if (!userId && !demoMode) return
    
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
      } else if (userId) {
        // 生产模式：从API获取真实数据
        console.log('🔄 从数据库加载习惯数据')
        const response = await fetch(`/api/habits?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          
          // 转换数据库格式到前端格式
          const transformedHabits: Habit[] = await Promise.all(
            data.habits.map(async (dbHabit: any) => {
              // 获取今日完成记录
              const today = new Date().toISOString().split('T')[0]
              const logsResponse = await fetch(`/api/habits/logs?userId=${userId}&habitId=${dbHabit.id}&date=${today}`)
              const logsData = await logsResponse.json()
              const completedToday = logsData.logs?.length > 0

              // 计算连续天数
              const allLogsResponse = await fetch(`/api/habits/logs?userId=${userId}&habitId=${dbHabit.id}`)
              const allLogsData = await allLogsResponse.json()
              const streak = calculateStreak(allLogsData.logs || [])

              return {
                id: dbHabit.id,
                name: dbHabit.name,
                icon: dbHabit.icon,
                category: dbHabit.category,
                streak,
                completedToday,
                createdAt: dbHabit.created_at,
              }
            })
          )
          
          setHabits(transformedHabits)
        } else {
          console.error('获取习惯数据失败')
        }
      }
    } catch (error) {
      console.error('加载习惯数据时出错:', error)
    } finally {
      setLoadingHabits(false)
    }
  }, [demoMode])

  // 计算连续天数
  const calculateStreak = (logs: any[]) => {
    if (!logs.length) return 0
    
    const sortedLogs = logs.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
    let streak = 0
    let currentDate = new Date()
    
    for (const log of sortedLogs) {
      const logDate = new Date(log.completed_at)
      const diffDays = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === streak) {
        streak++
        currentDate = logDate
      } else {
        break
      }
    }
    
    return streak
  }

  // 切换习惯完成状态
  const toggleHabit = useCallback(async (habitId: string, userId: string) => {
    if (demoMode) {
      // 演示模式：只更新本地状态
      setHabits(prev => prev.map(habit => 
        habit.id === habitId 
          ? {
              ...habit,
              completedToday: !habit.completedToday,
              streak: !habit.completedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1)
            }
          : habit
      ))
      return
    }

    try {
      const habit = habits.find(h => h.id === habitId)
      if (!habit) return

      if (!habit.completedToday) {
        // 记录完成
        const response = await fetch('/api/habits/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            habit_id: habitId,
          }),
        })

        if (response.ok) {
          // 刷新数据
          await refreshHabits(userId)
        }
      } else {
        // 取消完成 - 需要找到今日的记录并删除
        const today = new Date().toISOString().split('T')[0]
        const logsResponse = await fetch(`/api/habits/logs?userId=${userId}&habitId=${habitId}&date=${today}`)
        if (logsResponse.ok) {
          const logsData = await logsResponse.json()
          if (logsData.logs?.length > 0) {
            await fetch(`/api/habits/logs?id=${logsData.logs[0].id}`, {
              method: 'DELETE',
            })
            await refreshHabits(userId)
          }
        }
      }
    } catch (error) {
      console.error('切换习惯状态失败:', error)
    }
  }, [habits, refreshHabits, demoMode])

  // 添加新习惯
  const addHabit = useCallback(async (habitData: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'completedToday'>, userId: string) => {
    if (demoMode) {
      // 演示模式：只更新本地状态
      const newHabit: Habit = {
        ...habitData,
        id: Date.now().toString(),
        streak: 0,
        completedToday: false,
        createdAt: new Date().toISOString(),
      }
      setHabits(prev => [newHabit, ...prev])
      return
    }

    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          name: habitData.name,
          icon: habitData.icon,
          category: habitData.category,
        }),
      })

      if (response.ok) {
        await refreshHabits(userId)
      }
    } catch (error) {
      console.error('添加习惯失败:', error)
    }
  }, [refreshHabits, demoMode])

  // 删除习惯
  const deleteHabit = useCallback(async (habitId: string) => {
    if (demoMode) {
      // 演示模式：只更新本地状态
      setHabits(prev => prev.filter(h => h.id !== habitId))
      return
    }

    try {
      const response = await fetch(`/api/habits?id=${habitId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setHabits(prev => prev.filter(h => h.id !== habitId))
      }
    } catch (error) {
      console.error('删除习惯失败:', error)
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
          toggleHabit,
          addHabit,
          deleteHabit,
        }}
      >
        {children}
        <Toaster />
      </AppContext.Provider>
    </ThemeProvider>
  )
}
