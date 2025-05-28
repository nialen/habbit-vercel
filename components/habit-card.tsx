"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, CheckCircle, Clock, MessageCircle, Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface Habit {
  id: string
  name: string
  icon: string
  streak: number
  completedToday: boolean
  category: string
  createdAt: string
}

interface HabitCardProps {
  habit: Habit
  onToggle: (habitId: string) => void
  onAddEncouragement?: (habitId: string, message: string) => void
}

export function HabitCard({ habit, onToggle, onAddEncouragement }: HabitCardProps) {
  const [showEncouragement, setShowEncouragement] = useState(false)
  const [encouragementMessage, setEncouragementMessage] = useState("")

  const handleEncouragement = () => {
    if (encouragementMessage.trim() && onAddEncouragement) {
      onAddEncouragement(habit.id, encouragementMessage)
      setEncouragementMessage("")
      setShowEncouragement(false)
    }
  }

  const getStreakBadge = (streak: number) => {
    if (streak >= 30) return { text: "习惯大师", color: "bg-purple-500" }
    if (streak >= 21) return { text: "坚持之星", color: "bg-blue-500" }
    if (streak >= 7) return { text: "一周达人", color: "bg-green-500" }
    if (streak >= 3) return { text: "初见成效", color: "bg-yellow-500" }
    return null
  }

  const streakBadge = getStreakBadge(habit.streak)

  return (
    <Card className="card-hover overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl flex items-center justify-center text-2xl">
              {habit.icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{habit.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {habit.category}
                </Badge>
                {streakBadge && (
                  <Badge className={cn("text-xs text-white", streakBadge.color)}>
                    <Award size={12} className="mr-1" />
                    {streakBadge.text}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500 star-animation" size={20} />
              <span className="font-medium">连续天数</span>
            </div>
            <span className="text-2xl font-bold text-orange-600">{habit.streak}</span>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => onToggle(habit.id)}
              className={cn(
                "flex-1",
                habit.completedToday ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600",
              )}
            >
              {habit.completedToday ? (
                <>
                  <CheckCircle size={16} className="mr-2" />
                  已完成
                </>
              ) : (
                <>
                  <Clock size={16} className="mr-2" />
                  立即打卡
                </>
              )}
            </Button>

            <Button variant="outline" size="sm" onClick={() => setShowEncouragement(!showEncouragement)}>
              <MessageCircle size={16} />
            </Button>
          </div>

          {showEncouragement && (
            <div className="space-y-2 p-3 bg-blue-50 rounded-xl">
              <textarea
                value={encouragementMessage}
                onChange={(e) => setEncouragementMessage(e.target.value)}
                placeholder="给孩子写一句鼓励的话..."
                className="w-full p-2 border border-blue-200 rounded-lg resize-none text-sm"
                rows={2}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleEncouragement} className="bg-blue-500 hover:bg-blue-600">
                  发送鼓励
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowEncouragement(false)}>
                  取消
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
