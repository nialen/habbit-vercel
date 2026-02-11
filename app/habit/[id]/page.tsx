"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getHabitById } from "@/lib/habits"
import {
    getProgress,
    saveCheckIn,
    hasCheckedInToday,
    getCurrentDay,
    getCheckInCount,
    resetProgress,
    isHabitCompleted,
    getStreakStatus,
    canUseRevive,
    useReviveCard
} from "@/lib/progress"
import { ProgressDots } from "@/components/progress-dots"

export default function HabitPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap the async params
    const { id } = use(params)

    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [checkedInToday, setCheckedInToday] = useState(false)
    const [currentDay, setCurrentDay] = useState(1)
    const [checkInCount, setCheckInCount] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [showRevivePrompt, setShowRevivePrompt] = useState(false)
    const [streakBroken, setStreakBroken] = useState(false)
    const [canRevive, setCanRevive] = useState(false)

    const habit = getHabitById(id)

    useEffect(() => {
        setMounted(true)
        updateProgress()
        checkStreak()
    }, [id])

    const checkStreak = () => {
        const status = getStreakStatus(id)
        setStreakBroken(status.isBroken)
        setCanRevive(status.canRevive)

        // Show revive prompt if streak is broken and can revive
        if (status.isBroken && status.canRevive) {
            setShowRevivePrompt(true)
        }
    }

    const updateProgress = () => {
        setCheckedInToday(hasCheckedInToday(id))
        setCurrentDay(getCurrentDay(id))
        setCheckInCount(getCheckInCount(id))
    }

    const handleUseRevive = () => {
        const success = useReviveCard(id)
        if (success) {
            setShowRevivePrompt(false)
            setCanRevive(false)
            setStreakBroken(false)
            updateProgress()
        }
    }

    const handleCheckIn = () => {
        if (checkedInToday || isAnimating) return

        setIsAnimating(true)
        const success = saveCheckIn(id)

        if (success) {
            // Update state
            setCheckedInToday(true)
            setCheckInCount(prev => prev + 1)

            // Check if completed 21 days
            setTimeout(() => {
                if (isHabitCompleted(id)) {
                    router.push(`/celebration?habit=${id}`)
                } else {
                    // Update current day from storage
                    setCurrentDay(getCurrentDay(id))
                    setIsAnimating(false)
                }
            }, 1500)
        } else {
            setIsAnimating(false)
        }
    }

    const handleReset = () => {
        if (confirm('确定要放弃这个习惯挑战吗？进度将会清空。')) {
            resetProgress(id)
            updateProgress()
            // Clear streak warnings
            setStreakBroken(false)
            setCanRevive(false)
            setShowRevivePrompt(false)
        }
    }

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kidsPrimary-50 via-kidsSecondary-50 to-kidsPurple-50">
                <div className="text-6xl animate-bounce">⏳</div>
            </div>
        )
    }

    if (!habit) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kidsPrimary-50 via-kidsSecondary-50 to-kidsPurple-50 px-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">😅</div>
                    <h2 className="text-2xl font-bold text-kidsPrimary-700 mb-4">找不到这个习惯</h2>
                    <Link href="/choose-habit">
                        <button className="bg-kidsPrimary-500 text-white px-6 py-3 rounded-xl font-semibold">
                            重新选择
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-kidsPrimary-50 via-kidsSecondary-50 to-kidsPurple-50 px-4 py-8">
            <div className="max-w-lg mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/choose-habit"
                        className="inline-flex items-center text-kidsPrimary-600 hover:text-kidsPrimary-700 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-6 h-6 mr-2" />
                        <span className="text-lg font-semibold">返回</span>
                    </Link>
                </div>

                {/* Habit Info */}
                <div className="text-center mb-8">
                    <div className="text-8xl mb-4 animate-bounce-slow">
                        {habit.emoji}
                    </div>
                    <h1 className="text-3xl font-bold text-kidsPrimary-700 mb-2">
                        {habit.name}
                    </h1>
                    <p className="text-2xl font-semibold text-kidsSecondary-600">
                        第 {currentDay} 天 / 21天
                    </p>
                </div>

                {/* Progress Dots */}
                <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
                    <ProgressDots
                        completedDays={checkInCount}
                        revivedDays={getProgress(id)?.revivedDays || []}
                        checkInDates={[...(getProgress(id)?.checkIns || []), ...(getProgress(id)?.revivedDays || [])].sort()}
                    />
                </div>

                {/* Check-in Button */}
                <button
                    onClick={handleCheckIn}
                    disabled={checkedInToday || isAnimating}
                    className={`
            w-full h-20 
            text-white text-2xl font-bold
            rounded-2xl
            shadow-lg
            transition-all duration-300
            ${checkedInToday
                            ? 'bg-gradient-to-r from-kidsPrimary-300 to-kidsPrimary-400 cursor-not-allowed'
                            : isAnimating
                                ? 'bg-gradient-to-r from-kidsPrimary-500 to-kidsPrimary-600 animate-pulse'
                                : 'bg-gradient-to-r from-kidsPrimary-500 to-kidsPrimary-600 hover:from-kidsPrimary-600 hover:to-kidsPrimary-700 hover:shadow-xl active:scale-95'
                        }
          `}
                >
                    {checkedInToday ? (
                        <>
                            <span className="mr-2">✓</span>
                            今天已完成！
                        </>
                    ) : (
                        <>
                            <span className="mr-2">✓</span>
                            今天完成了！
                        </>
                    )}
                </button>

                {/* Encouragement Text */}
                {checkedInToday && (
                    <div className="text-center mt-6 animate-bounce">
                        <p className="text-xl text-kidsPrimary-600 font-semibold">
                            🎉 太棒了！明天继续加油！
                        </p>
                    </div>
                )}

                {/* Reset Link */}
                <div className="text-center mt-8">
                    <button
                        onClick={handleReset}
                        className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
                    >
                        放弃挑战
                    </button>
                </div>
            </div>

            {/* Revive Prompt Modal */}
            {showRevivePrompt && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="text-center">
                            <div className="text-7xl mb-4 animate-bounce">😰</div>
                            <h2 className="text-2xl font-bold text-kidsPrimary-700 mb-3">
                                挑战中断了！
                            </h2>
                            <p className="text-lg text-kidsPrimary-600 mb-2">
                                昨天忘记打卡了...
                            </p>
                            <p className="text-base text-kidsPrimary-500 mb-6">
                                使用续命卡继续挑战？
                            </p>

                            <div className="bg-kidsAccent-50 rounded-xl p-4 mb-6">
                                <p className="text-sm text-kidsAccent-700">
                                    ⚡ 每个习惯只有 <span className="font-bold">1次</span> 续命机会
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleUseRevive}
                                    className="w-full h-14 bg-gradient-to-r from-kidsAccent-500 to-kidsAccent-600 hover:from-kidsAccent-600 hover:to-kidsAccent-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
                                >
                                    ⚡ 使用续命卡
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="w-full h-12 text-gray-500 hover:text-gray-700 text-base font-semibold transition-colors"
                                >
                                    放弃挑战
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Streak Broken Warning (if can't revive) */}
            {streakBroken && !canRevive && !showRevivePrompt && (
                <div className="fixed bottom-8 left-4 right-4 mx-auto max-w-md z-40">
                    <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-4 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl">❌</div>
                            <div className="flex-1">
                                <p className="font-bold text-red-700 mb-1">挑战已中断</p>
                                <p className="text-sm text-red-600">续命卡已用完或超时</p>
                            </div>
                            <button
                                onClick={handleReset}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                            >
                                重新开始
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
