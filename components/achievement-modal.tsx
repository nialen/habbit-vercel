"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Star, X } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  color: string
  unlockedAt: string
}

interface AchievementModalProps {
  achievement: Achievement | null
  onClose: () => void
}

export function AchievementModal({ achievement, onClose }: AchievementModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
    }
  }, [achievement])

  if (!achievement) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card
        className={`max-w-md w-full transform transition-all duration-500 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <CardContent className="p-8 text-center relative">
          <Button variant="ghost" size="sm" onClick={onClose} className="absolute top-4 right-4">
            <X size={16} />
          </Button>

          <div className="mb-6">
            <div
              className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 ${achievement.color}`}
            >
              {achievement.icon}
            </div>
            <h2 className="text-2xl font-bold gradient-text mb-2">🎉 恭喜获得成就！</h2>
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <Award size={14} className="mr-1" />
              {achievement.title}
            </Badge>
          </div>

          <p className="text-gray-600 mb-6">{achievement.description}</p>

          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="text-yellow-500 fill-current star-animation" size={20} />
            ))}
          </div>

          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500"
          >
            太棒了！
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
