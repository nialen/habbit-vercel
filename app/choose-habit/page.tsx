"use client"

import Link from "next/link"
import { PRESET_HABITS } from "@/lib/habits"
import { ArrowLeft } from "lucide-react"

export default function ChooseHabitPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-kidsPrimary-50 via-kidsSecondary-50 to-kidsPurple-50 px-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header with Back Button */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-kidsPrimary-600 hover:text-kidsPrimary-700 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-6 h-6 mr-2" />
                        <span className="text-lg font-semibold">返回</span>
                    </Link>

                    <h1 className="text-3xl md:text-4xl font-bold text-kidsPrimary-700 text-center mb-2">
                        选择一个习惯
                    </h1>
                    <p className="text-center text-kidsPrimary-600 text-lg">
                        一次只专注一个习惯，坚持21天 ✨
                    </p>
                </div>

                {/* Habit Cards */}
                <div className="space-y-4">
                    {PRESET_HABITS.map((habit) => (
                        <Link
                            key={habit.id}
                            href={`/habit/${habit.id}`}
                            className="block"
                        >
                            <div className="
                bg-white rounded-2xl p-6 
                shadow-md hover:shadow-xl 
                transition-all duration-200
                hover:scale-[1.02]
                active:scale-[0.98]
                border-2 border-transparent
                hover:border-kidsPrimary-300
              ">
                                <div className="flex items-center gap-4">
                                    {/* Emoji */}
                                    <div className="text-6xl flex-shrink-0">
                                        {habit.emoji}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-kidsPrimary-700 mb-1">
                                            {habit.name}
                                        </h2>
                                        {habit.description && (
                                            <p className="text-kidsPrimary-500 text-sm">
                                                {habit.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Arrow */}
                                    <div className="text-kidsPrimary-400">
                                        <svg
                                            className="w-8 h-8"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="mt-8 text-center">
                    <p className="text-kidsPrimary-500 text-sm">
                        💡 小贴士：完成一个习惯后，可以开始下一个哦
                    </p>
                </div>
            </div>
        </div>
    )
}
