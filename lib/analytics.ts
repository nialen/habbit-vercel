// Plausible Analytics utilities
declare global {
  interface Window {
    plausible: (event: string, options?: { props?: Record<string, string | number> }) => void
  }
}

export const analytics = {
  // 页面浏览事件（自动触发，通常不需要手动调用）
  pageview: (url?: string) => {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible('pageview', url ? { props: { url } } : undefined)
    }
  },

  // 习惯相关事件
  habit: {
    created: (habitName: string) => {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible('Habit Created', { props: { habit: habitName } })
      }
    },
    completed: (habitName: string) => {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible('Habit Completed', { props: { habit: habitName } })
      }
    },
    streak: (days: number) => {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible('Habit Streak', { props: { days: days.toString() } })
      }
    }
  },

  // AI顾问相关事件
  ai: {
    question: (category: string) => {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible('AI Question', { props: { category } })
      }
    },
    suggestion: (type: string) => {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible('AI Suggestion Used', { props: { type } })
      }
    }
  },

  // 奖励系统事件
  reward: {
    redeemed: (rewardName: string, points: number) => {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible('Reward Redeemed', { 
          props: { 
            reward: rewardName, 
            points: points.toString() 
          } 
        })
      }
    },
    earned: (points: number) => {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible('Points Earned', { props: { points: points.toString() } })
      }
    }
  },

  // 社区活动事件
  community: {
    postCreated: (category: string) => {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible('Community Post', { props: { category } })
      }
    },
    eventJoined: (eventType: string) => {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible('Event Joined', { props: { type: eventType } })
      }
    }
  },

  // 用户相关事件
  user: {
    signup: (method: string) => {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible('User Signup', { props: { method } })
      }
    },
    login: (method: string) => {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible('User Login', { props: { method } })
      }
    },
    profileComplete: () => {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible('Profile Completed')
      }
    }
  },

  // 通用事件追踪
  track: (eventName: string, props?: Record<string, string | number>) => {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(eventName, props ? { props } : undefined)
    }
  }
}

export default analytics 