// Plausible Analytics utilities
declare global {
  interface Window {
    plausible: (event: string, options?: { props?: Record<string, string | number> }) => void
  }
}

// 检查是否在生产环境
const IS_PRODUCTION = process.env.NODE_ENV === "production"
const IS_CLIENT = typeof window !== "undefined"

// 调试日志函数
const debugLog = (message: string, data?: any) => {
  if (!IS_PRODUCTION && IS_CLIENT) {
    console.log(`🔍 [Plausible Debug] ${message}`, data || "")
  }
}

// 安全调用Plausible的包装函数
const safePlausibleCall = (event: string, options?: { props?: Record<string, string | number> }) => {
  if (!IS_CLIENT) {
    debugLog("服务端渲染，跳过分析事件", { event, options })
    return
  }

  if (!IS_PRODUCTION) {
    debugLog("开发环境，模拟分析事件", { event, options })
    return
  }

  if (!window.plausible) {
    console.warn("⚠️ Plausible Analytics未加载，请检查配置")
    return
  }

  try {
    window.plausible(event, options)
    debugLog("分析事件已发送", { event, options })
  } catch (error) {
    console.error("❌ Plausible Analytics事件发送失败:", error)
  }
}

export const analytics = {
  // 页面浏览事件（自动触发，通常不需要手动调用）
  pageview: (url?: string) => {
    safePlausibleCall('pageview', url ? { props: { url } } : undefined)
  },

  // 习惯相关事件
  habit: {
    created: (habitName: string) => {
      safePlausibleCall('Habit Created', { props: { habit: habitName } })
    },
    completed: (habitName: string) => {
      safePlausibleCall('Habit Completed', { props: { habit: habitName } })
    },
    streak: (days: number) => {
      safePlausibleCall('Habit Streak', { props: { days: days.toString() } })
    }
  },

  // AI顾问相关事件
  ai: {
    question: (category: string) => {
      safePlausibleCall('AI Question', { props: { category } })
    },
    suggestion: (type: string) => {
      safePlausibleCall('AI Suggestion Used', { props: { type } })
    }
  },

  // 奖励系统事件
  reward: {
    redeemed: (rewardName: string, points: number) => {
      safePlausibleCall('Reward Redeemed', { 
        props: { 
          reward: rewardName, 
          points: points.toString() 
        } 
      })
    },
    earned: (points: number) => {
      safePlausibleCall('Points Earned', { props: { points: points.toString() } })
    }
  },

  // 社区活动事件
  community: {
    postCreated: (category: string) => {
      safePlausibleCall('Community Post', { props: { category } })
    },
    eventJoined: (eventType: string) => {
      safePlausibleCall('Event Joined', { props: { type: eventType } })
    }
  },

  // 用户相关事件
  user: {
    signup: (method: string) => {
      safePlausibleCall('User Signup', { props: { method } })
    },
    login: (method: string) => {
      safePlausibleCall('User Login', { props: { method } })
    },
    profileComplete: () => {
      safePlausibleCall('Profile Completed')
    }
  },

  // 通用事件追踪
  track: (eventName: string, props?: Record<string, string | number>) => {
    safePlausibleCall(eventName, props ? { props } : undefined)
  }
}

export default analytics 