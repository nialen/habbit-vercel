export type Habit = {
    id: string
    name: string
    emoji: string
    description?: string
}

export const PRESET_HABITS: Habit[] = [
    {
        id: 'brush-teeth',
        name: '早晚刷牙',
        emoji: '🦷',
        description: '每天早晚刷牙，保护牙齿健康'
    },
    {
        id: 'reading',
        name: '睡前阅读',
        emoji: '📖',
        description: '每天睡前读一个小故事'
    },
    {
        id: 'tidy-toys',
        name: '整理玩具',
        emoji: '🧸',
        description: '玩完玩具后放回原位'
    },
    {
        id: 'dress-self',
        name: '自己穿衣',
        emoji: '👕',
        description: '学会自己穿衣服'
    },
    {
        id: 'sleep-time',
        name: '按时睡觉',
        emoji: '😴',
        description: '每天准时上床睡觉'
    }
]

export function getHabitById(id: string): Habit | undefined {
    return PRESET_HABITS.find(habit => habit.id === id)
}
