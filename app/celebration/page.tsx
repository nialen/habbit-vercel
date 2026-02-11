"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { getHabitById } from "@/lib/habits"
import { getProgress } from "@/lib/progress"

export default function CelebrationPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const habitId = searchParams.get('habit')
    const [mounted, setMounted] = useState(false)

    const habit = habitId ? getHabitById(habitId) : null
    const progress = habitId ? getProgress(habitId) : null
    const usedRevive = progress?.reviveUsed || false

    useEffect(() => {
        setMounted(true)

        // Trigger confetti animation
        if (typeof window !== 'undefined') {
            triggerConfetti()
        }
    }, [])

    const triggerConfetti = () => {
        // Simple confetti effect using CSS animations
        const colors = ['#22c55e', '#eab308', '#f97316', '#a855f7', '#ec4899']
        const confettiCount = 50

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                createConfettiPiece(colors[Math.floor(Math.random() * colors.length)])
            }, i * 30)
        }
    }

    const createConfettiPiece = (color: string) => {
        const confetti = document.createElement('div')
        confetti.style.position = 'fixed'
        confetti.style.width = '10px'
        confetti.style.height = '10px'
        confetti.style.backgroundColor = color
        confetti.style.left = Math.random() * 100 + '%'
        confetti.style.top = '-10px'
        confetti.style.opacity = '1'
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`
        confetti.style.transition = 'all 3s ease-out'
        confetti.style.pointerEvents = 'none'
        confetti.style.zIndex = '9999'
        confetti.style.borderRadius = '50%'

        document.body.appendChild(confetti)

        setTimeout(() => {
            confetti.style.top = '100vh'
            confetti.style.left = (parseFloat(confetti.style.left) + (Math.random() - 0.5) * 100) + '%'
            confetti.style.opacity = '0'
            confetti.style.transform = `rotate(${Math.random() * 720}deg)`
        }, 10)

        setTimeout(() => {
            document.body.removeChild(confetti)
        }, 3000)
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
                    <h2 className="text-2xl font-bold text-kidsPrimary-700 mb-4">找不到习惯信息</h2>
                    <Link href="/choose-habit">
                        <button className="bg-kidsPrimary-500 text-white px-6 py-3 rounded-xl font-semibold">
                            开始新习惯
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-kidsPrimary-50 via-kidsSecondary-50 to-kidsPurple-50 px-4 py-8 flex items-center justify-center">
            <div className="max-w-2xl w-full">
                {/* Celebration Content */}
                <div className="text-center">
                    {/* Big Emoji */}
                    <div className="text-9xl mb-6 animate-bounce">
                        🎉
                    </div>

                    {/* Congratulations */}
                    <h1 className="text-4xl md:text-5xl font-bold text-kidsPrimary-700 mb-4">
                        恭喜你！
                    </h1>

                    {/* Achievement */}
                    <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8 border-4 border-kidsSecondary-300">
                        <div className="text-7xl mb-4">{habit.emoji}</div>
                        <p className="text-2xl md:text-3xl text-kidsPrimary-600 mb-2">
                            你坚持了 <span className="font-bold text-kidsPrimary-700">21天</span>
                        </p>
                        <p className="text-xl md:text-2xl text-kidsPrimary-700 font-bold">
                            成功养成【{habit.name}】习惯！
                        </p>

                        {/* Certificate Badge */}
                        <div className="mt-6 inline-block">
                            <div className="bg-gradient-to-br from-kidsSecondary-400 to-kidsSecondary-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                                ⭐ 21天挑战完成 ⭐
                            </div>
                        </div>

                        {/* Revive Usage Badge */}
                        {usedRevive && (
                            <div className="mt-4">
                                <div className="inline-flex items-center gap-2 bg-kidsAccent-100 border-2 border-kidsAccent-300 text-kidsAccent-700 px-4 py-2 rounded-full font-semibold text-sm">
                                    <span>⚡</span>
                                    <span>使用了 1 次续命</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Encouragement */}
                    <div className="mb-8">
                        <p className="text-xl text-kidsPrimary-600 mb-4">
                            🌟 太棒了！你已经成功养成了一个好习惯！
                        </p>
                        <p className="text-lg text-kidsPrimary-500">
                            继续保持，或者开始下一个习惯挑战吧！
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <Link href="/choose-habit">
                            <button className="
                w-full h-16
                bg-gradient-to-r from-kidsPrimary-500 to-kidsPrimary-600
                hover:from-kidsPrimary-600 hover:to-kidsPrimary-700
                text-white text-xl font-bold
                rounded-2xl
                shadow-lg hover:shadow-xl
                transition-all duration-200
                active:scale-95
              ">
                                <span className="mr-2">🚀</span>
                                开始下一个习惯挑战
                            </button>
                        </Link>

                        <Link href="/">
                            <button className="
                w-full h-14
                bg-white
                text-kidsPrimary-600
                text-lg font-semibold
                rounded-xl
                border-2 border-kidsPrimary-300
                hover:border-kidsPrimary-400
                transition-all duration-200
                active:scale-95
              ">
                                返回首页
                            </button>
                        </Link>
                    </div>

                    {/* Screenshot Tip */}
                    <div className="mt-8">
                        <p className="text-sm text-kidsPrimary-400">
                            💡 可以截图保存这个成就哦
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
