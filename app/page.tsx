"use client"

import Link from "next/link"
import { useState } from "react"

export default function HomePage() {
  const [isPressed, setIsPressed] = useState(false)

  const handleButtonClick = () => {
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 300)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kidsPrimary-50 via-kidsSecondary-50 to-kidsPurple-50 px-4">
      <div className="text-center max-w-md w-full">
        {/* Emoji Icon */}
        <div className="text-8xl mb-8 animate-bounce-slow">
          🌱
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-bold text-kidsPrimary-700 mb-4 leading-tight">
          帮孩子养成好习惯
        </h1>
        <p className="text-2xl md:text-3xl font-semibold text-kidsSecondary-600 mb-12">
          只需要21天
        </p>

        {/* CTA Button */}
        <Link href="/choose-habit">
          <button
            onClick={handleButtonClick}
            className={`
              w-full h-16 md:h-20
              bg-gradient-to-r from-kidsPrimary-500 to-kidsPrimary-600
              hover:from-kidsPrimary-600 hover:to-kidsPrimary-700
              text-white text-xl md:text-2xl font-bold
              rounded-2xl
              shadow-lg hover:shadow-xl
              transition-all duration-200
              ${isPressed ? 'scale-95' : 'scale-100'}
              active:scale-95
            `}
          >
            <span className="mr-2">✨</span>
            开始第一个习惯挑战
            <span className="ml-2">🚀</span>
          </button>
        </Link>

        {/* Subtitle */}
        <p className="mt-8 text-kidsPrimary-500 text-sm md:text-base">
          每天只需点一下，养成好习惯就这么简单
        </p>
      </div>
    </div>
  )
}
