import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 格式化时间函数
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// 计算年龄对应的发展阶段
export function getDevelopmentStage(age: number): string {
  if (age <= 3) return "幼儿期"
  if (age <= 6) return "学龄前期"
  if (age <= 12) return "学龄期"
  return "青少年期"
}

// 生成随机ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
