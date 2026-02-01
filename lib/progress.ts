export type Progress = {
    habitId: string
    startDate: string  // ISO date string (YYYY-MM-DD)
    checkIns: string[] // Array of ISO date strings
    revivedDays: string[] // Dates that were revived with the revive card
    reviveUsed: boolean // Whether the one-time revive card has been used
    lastCheckInDate?: string // Last check-in date for streak detection
}

const STORAGE_KEY = 'habit-progress'

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
    const today = new Date()
    return today.toISOString().split('T')[0]
}

/**
 * Get progress for a specific habit
 */
export function getProgress(habitId: string): Progress | null {
    if (typeof window === 'undefined') return null

    try {
        const stored = localStorage.getItem(`${STORAGE_KEY}-${habitId}`)
        if (!stored) return null

        const progress = JSON.parse(stored) as Progress

        // Migrate old data format to new format
        if (!progress.revivedDays) {
            progress.revivedDays = []
        }
        if (progress.reviveUsed === undefined) {
            progress.reviveUsed = false
        }
        if (!progress.lastCheckInDate && progress.checkIns.length > 0) {
            progress.lastCheckInDate = progress.checkIns[progress.checkIns.length - 1]
        }

        // Save migrated data
        saveProgress(progress)

        return progress
    } catch (error) {
        console.error('Error reading progress:', error)
        return null
    }
}

/**
 * Initialize progress for a new habit
 */
export function initializeProgress(habitId: string): Progress {
    const progress: Progress = {
        habitId,
        startDate: getTodayDate(),
        checkIns: [],
        revivedDays: [],
        reviveUsed: false,
        lastCheckInDate: undefined
    }

    saveProgress(progress)
    return progress
}

/**
 * Save progress to localStorage
 */
export function saveProgress(progress: Progress): void {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(
            `${STORAGE_KEY}-${progress.habitId}`,
            JSON.stringify(progress)
        )
    } catch (error) {
        console.error('Error saving progress:', error)
    }
}

/**
 * Add a check-in for today
 */
export function saveCheckIn(habitId: string): boolean {
    const progress = getProgress(habitId) || initializeProgress(habitId)
    const today = getTodayDate()

    // Check if already checked in today
    if (progress.checkIns.includes(today)) {
        return false
    }

    // Add today's check-in
    progress.checkIns.push(today)
    progress.lastCheckInDate = today
    saveProgress(progress)
    return true
}

/**
 * Check if user has checked in today
 */
export function hasCheckedInToday(habitId: string): boolean {
    const progress = getProgress(habitId)
    if (!progress) return false

    const today = getTodayDate()
    return progress.checkIns.includes(today)
}

/**
 * Get current day number (1-21)
 * Returns the day number user is currently on based on check-ins
 */
export function getCurrentDay(habitId: string): number {
    const progress = getProgress(habitId)
    if (!progress) return 1

    // Count both regular check-ins and revived days
    const revivedDays = progress.revivedDays || []
    const totalDays = progress.checkIns.length + revivedDays.length

    // If user has checked in, they're on that day number
    // If no check-ins yet, they're on day 1
    return totalDays === 0 ? 1 : totalDays
}

/**
 * Get total check-ins count (including revived days)
 */
export function getCheckInCount(habitId: string): number {
    const progress = getProgress(habitId)
    if (!progress) return 0

    // Count both regular check-ins and revived days
    const revivedDays = progress.revivedDays || []
    return progress.checkIns.length + revivedDays.length
}

/**
 * Check if habit is completed (21 days)
 */
export function isHabitCompleted(habitId: string): boolean {
    return getCheckInCount(habitId) >= 21
}

/**
 * Reset progress for a habit
 */
export function resetProgress(habitId: string): void {
    if (typeof window === 'undefined') return

    try {
        localStorage.removeItem(`${STORAGE_KEY}-${habitId}`)
    } catch (error) {
        console.error('Error resetting progress:', error)
    }
}

/**
 * Get all habit IDs with progress
 */
export function getAllProgressHabits(): string[] {
    if (typeof window === 'undefined') return []

    const habits: string[] = []
    const prefix = `${STORAGE_KEY}-`

    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key?.startsWith(prefix)) {
                habits.push(key.replace(prefix, ''))
            }
        }
    } catch (error) {
        console.error('Error getting all habits:', error)
    }

    return habits
}

/**
 * Get date for yesterday
 */
function getYesterdayDate(): string {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toISOString().split('T')[0]
}

/**
 * Calculate days between two dates
 */
function daysBetween(date1: string, date2: string): number {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = Math.abs(d2.getTime() - d1.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Check if streak is broken (missed yesterday's check-in)
 */
export function isStreakBroken(habitId: string): boolean {
    const progress = getProgress(habitId)
    if (!progress || progress.checkIns.length === 0) return false

    const today = getTodayDate()
    const yesterday = getYesterdayDate()

    // If already checked in today, streak is not broken
    if (progress.checkIns.includes(today)) return false

    // If yesterday was checked in or revived, streak is not broken
    const revivedDays = progress.revivedDays || []
    if (progress.checkIns.includes(yesterday) || revivedDays.includes(yesterday)) {
        return false
    }

    // If last check-in was yesterday or today, not broken
    const lastCheckIn = progress.lastCheckInDate || progress.checkIns[progress.checkIns.length - 1]
    if (!lastCheckIn) return false
    if (lastCheckIn === yesterday || lastCheckIn === today) {
        return false
    }

    // If there's a gap of more than 1 day, streak is broken
    const daysSinceLastCheckIn = daysBetween(lastCheckIn, today)
    return daysSinceLastCheckIn > 1
}

/**
 * Check if within 24-hour window to use revive card
 */
export function withinReviveWindow(habitId: string): boolean {
    const progress = getProgress(habitId)
    if (!progress) return false

    const yesterday = getYesterdayDate()
    const revivedDays = progress.revivedDays || []

    // Can only revive yesterday's missed check-in
    // Check if yesterday was missed and today we're trying to revive
    return !progress.checkIns.includes(yesterday) && !revivedDays.includes(yesterday)
}

/**
 * Check if user can use the revive card
 */
export function canUseRevive(habitId: string): boolean {
    const progress = getProgress(habitId)
    if (!progress) return false

    // Can't use if already used
    const reviveUsed = progress.reviveUsed || false
    if (reviveUsed) return false

    // Can't use if streak is not broken
    if (!isStreakBroken(habitId)) return false

    // Can't use if not within revive window
    if (!withinReviveWindow(habitId)) return false

    return true
}

/**
 * Use the revive card to recover yesterday's missed check-in
 */
export function useReviveCard(habitId: string): boolean {
    const progress = getProgress(habitId)
    if (!progress) return false

    // Check if can use revive
    if (!canUseRevive(habitId)) return false

    const yesterday = getYesterdayDate()

    // Add yesterday to revived days
    progress.revivedDays.push(yesterday)
    progress.reviveUsed = true
    progress.lastCheckInDate = yesterday

    saveProgress(progress)
    return true
}

/**
 * Get streak status information
 */
export function getStreakStatus(habitId: string): {
    isActive: boolean
    canRevive: boolean
    isBroken: boolean
    reviveUsed: boolean
} {
    const progress = getProgress(habitId)

    if (!progress) {
        return {
            isActive: true,
            canRevive: false,
            isBroken: false,
            reviveUsed: false
        }
    }

    const broken = isStreakBroken(habitId)
    const canReviveNow = canUseRevive(habitId)

    return {
        isActive: !broken,
        canRevive: canReviveNow,
        isBroken: broken,
        reviveUsed: progress.reviveUsed
    }
}
