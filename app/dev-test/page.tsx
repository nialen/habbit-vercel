"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PRESET_HABITS } from "@/lib/habits"
import { getProgress, saveProgress, resetProgress } from "@/lib/progress"

export default function DevTestPage() {
    const [selectedHabit, setSelectedHabit] = useState(PRESET_HABITS[0].id)
    const [message, setMessage] = useState("")

    const showMessage = (msg: string) => {
        setMessage(msg)
        setTimeout(() => setMessage(""), 3000)
    }

    // 模拟连续N天打卡
    const simulateConsecutiveDays = (days: number) => {
        const progress = getProgress(selectedHabit) || {
            habitId: selectedHabit,
            startDate: getDateString(-days),
            checkIns: [],
            revivedDays: [],
            reviveUsed: false,
            lastCheckInDate: undefined
        }

        const checkIns: string[] = []
        for (let i = days - 1; i >= 0; i--) {
            checkIns.push(getDateString(-i))
        }

        progress.checkIns = checkIns
        progress.lastCheckInDate = checkIns[checkIns.length - 1]
        saveProgress(progress)
        showMessage(`✅ 已模拟连续 ${days} 天打卡`)
    }

    // 模拟断卡场景（昨天没打卡）
    const simulateMissedYesterday = () => {
        const progress = getProgress(selectedHabit) || {
            habitId: selectedHabit,
            startDate: getDateString(-5),
            checkIns: [],
            revivedDays: [],
            reviveUsed: false,
            lastCheckInDate: undefined
        }

        // 前4天打卡，昨天漏了
        const checkIns: string[] = []
        for (let i = 5; i >= 2; i--) {
            checkIns.push(getDateString(-i))
        }

        progress.checkIns = checkIns
        progress.lastCheckInDate = checkIns[checkIns.length - 1]
        saveProgress(progress)
        showMessage(`⚠️ 已模拟昨天断卡（可以使用续命卡）`)
    }

    // 模拟使用过续命卡
    const simulateUsedRevive = () => {
        const progress = getProgress(selectedHabit) || {
            habitId: selectedHabit,
            startDate: getDateString(-10),
            checkIns: [],
            revivedDays: [],
            reviveUsed: false,
            lastCheckInDate: undefined
        }

        const checkIns: string[] = []
        for (let i = 10; i >= 1; i--) {
            if (i !== 5) { // 第5天用续命卡
                checkIns.push(getDateString(-i))
            }
        }

        progress.checkIns = checkIns
        progress.revivedDays = [getDateString(-5)] // 第5天用了续命
        progress.reviveUsed = true
        progress.lastCheckInDate = getDateString(-1)
        saveProgress(progress)
        showMessage(`⚡ 已模拟使用过续命卡（第5天）`)
    }

    // 模拟完成21天
    const simulateCompleted = () => {
        const progress = getProgress(selectedHabit) || {
            habitId: selectedHabit,
            startDate: getDateString(-21),
            checkIns: [],
            revivedDays: [],
            reviveUsed: false,
            lastCheckInDate: undefined
        }

        const checkIns: string[] = []
        for (let i = 21; i >= 1; i--) {
            checkIns.push(getDateString(-i))
        }

        progress.checkIns = checkIns
        progress.lastCheckInDate = checkIns[checkIns.length - 1]
        saveProgress(progress)
        showMessage(`🎉 已模拟完成21天挑战`)
    }

    // 清空数据
    const clearData = () => {
        resetProgress(selectedHabit)
        showMessage(`🗑️ 已清空数据`)
    }

    // 查看当前数据
    const viewData = () => {
        const progress = getProgress(selectedHabit)
        if (progress) {
            console.log("📊 当前进度数据：", progress)
            alert(JSON.stringify(progress, null, 2))
        } else {
            alert("暂无数据")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <span className="font-semibold">返回首页</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        🧪 开发者测试工具
                    </h1>
                    <p className="text-gray-600">
                        快速模拟各种打卡场景，测试连续打卡和续命卡功能
                    </p>
                </div>

                {/* Message */}
                {message && (
                    <div className="bg-blue-100 border-2 border-blue-300 text-blue-800 px-4 py-3 rounded-xl mb-6 animate-bounce">
                        {message}
                    </div>
                )}

                {/* Habit Selector */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        选择习惯：
                    </label>
                    <select
                        value={selectedHabit}
                        onChange={(e) => setSelectedHabit(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                    >
                        {PRESET_HABITS.map((habit) => (
                            <option key={habit.id} value={habit.id}>
                                {habit.emoji} {habit.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Test Scenarios */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">测试场景</h2>
                    <div className="space-y-3">
                        <button
                            onClick={() => simulateConsecutiveDays(5)}
                            className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors text-left"
                        >
                            ✅ 模拟连续 5 天打卡
                        </button>
                        <button
                            onClick={() => simulateConsecutiveDays(10)}
                            className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors text-left"
                        >
                            ✅ 模拟连续 10 天打卡
                        </button>
                        <button
                            onClick={() => simulateConsecutiveDays(20)}
                            className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors text-left"
                        >
                            ✅ 模拟连续 20 天打卡
                        </button>
                        <button
                            onClick={simulateCompleted}
                            className="w-full px-6 py-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-colors text-left"
                        >
                            🎉 模拟完成 21 天挑战
                        </button>
                        <button
                            onClick={simulateMissedYesterday}
                            className="w-full px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors text-left"
                        >
                            ⚠️ 模拟昨天断卡（触发续命提示）
                        </button>
                        <button
                            onClick={simulateUsedRevive}
                            className="w-full px-6 py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition-colors text-left"
                        >
                            ⚡ 模拟使用过续命卡
                        </button>
                    </div>
                </div>

                {/* Data Management */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">数据管理</h2>
                    <div className="space-y-3">
                        <button
                            onClick={viewData}
                            className="w-full px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors text-left"
                        >
                            📊 查看当前数据（控制台）
                        </button>
                        <button
                            onClick={clearData}
                            className="w-full px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors text-left"
                        >
                            🗑️ 清空数据
                        </button>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mt-6 bg-gray-100 rounded-2xl p-6">
                    <h3 className="font-semibold text-gray-700 mb-3">快速跳转：</h3>
                    <div className="space-y-2">
                        <Link
                            href={`/habit/${selectedHabit}`}
                            className="block px-4 py-3 bg-white hover:bg-gray-50 rounded-xl transition-colors text-gray-700 font-medium"
                        >
                            → 查看打卡页面
                        </Link>
                        <Link
                            href={`/celebration?habit=${selectedHabit}`}
                            className="block px-4 py-3 bg-white hover:bg-gray-50 rounded-xl transition-colors text-gray-700 font-medium"
                        >
                            → 查看庆祝页面
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Helper function to get date string
function getDateString(daysOffset: number): string {
    const date = new Date()
    date.setDate(date.getDate() + daysOffset)
    return date.toISOString().split('T')[0]
}
