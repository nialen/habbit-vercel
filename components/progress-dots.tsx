"use client"

interface ProgressDotsProps {
    totalDays?: number
    completedDays: number
    revivedDays?: string[]  // Array of revived dates
    checkInDates?: string[] // Array of all check-in dates (for mapping)
    className?: string
}

export function ProgressDots({
    totalDays = 21,
    completedDays,
    revivedDays = [],
    checkInDates = [],
    className = ""
}: ProgressDotsProps) {
    const dotsPerRow = 7
    const rows = Math.ceil(totalDays / dotsPerRow)

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            {Array.from({ length: rows }).map((_, rowIndex) => {
                const startIndex = rowIndex * dotsPerRow
                const endIndex = Math.min(startIndex + dotsPerRow, totalDays)
                const dotsInRow = endIndex - startIndex

                return (
                    <div key={rowIndex} className="flex justify-center gap-2">
                        {Array.from({ length: dotsInRow }).map((_, colIndex) => {
                            const dotIndex = startIndex + colIndex
                            const isCompleted = dotIndex < completedDays

                            // Check if this day was revived (orange dot)
                            const checkInDate = checkInDates[dotIndex]
                            const isRevived = checkInDate && revivedDays.includes(checkInDate)

                            return (
                                <div
                                    key={dotIndex}
                                    className={`
                    w-8 h-8 rounded-full
                    transition-all duration-300
                    ${isCompleted
                                            ? isRevived
                                                ? 'bg-gradient-to-br from-kidsAccent-400 to-kidsAccent-500 scale-100 shadow-md' // Orange for revived
                                                : 'bg-gradient-to-br from-kidsPrimary-500 to-kidsPrimary-600 scale-100 shadow-md' // Green for normal
                                            : 'bg-gray-200 scale-90'
                                        }
                  `}
                                    style={{
                                        transitionDelay: isCompleted ? `${dotIndex * 50}ms` : '0ms'
                                    }}
                                />
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}
