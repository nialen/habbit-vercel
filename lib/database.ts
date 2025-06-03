import { supabase } from "./supabase"
import type { Database } from "@/types/database"

type Tables = Database["public"]["Tables"]
type Habit = Tables["habits"]["Row"]
type HabitLog = Tables["habit_logs"]["Row"]
type Reward = Tables["rewards"]["Row"]
type Post = Tables["posts"]["Row"]
type Comment = Tables["comments"]["Row"]
type UserProfile = Tables["user_profiles"]["Row"]

// =============== 用户管理 ===============

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating user profile:", error)
    return null
  }

  return data
}

export async function createUserProfile(profile: Tables["user_profiles"]["Insert"]) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from("user_profiles")
    .insert(profile)
    .select()
    .single()

  if (error) {
    console.error("Error creating user profile:", error)
    return null
  }

  return data
}

// =============== 习惯管理 ===============

export async function getHabits(userId: string): Promise<Habit[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching habits:", error)
    return []
  }

  return data || []
}

export async function createHabit(habit: Tables["habits"]["Insert"]) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from("habits")
    .insert(habit)
    .select()
    .single()

  if (error) {
    console.error("Error creating habit:", error)
    return null
  }

  return data
}

export async function updateHabit(habitId: string, updates: Tables["habits"]["Update"]) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from("habits")
    .update(updates)
    .eq("id", habitId)
    .select()
    .single()

  if (error) {
    console.error("Error updating habit:", error)
    return null
  }

  return data
}

export async function deleteHabit(habitId: string) {
  if (!supabase) return false

  const { error } = await supabase
    .from("habits")
    .update({ is_active: false })
    .eq("id", habitId)

  if (error) {
    console.error("Error deleting habit:", error)
    return false
  }

  return true
}

// =============== 习惯记录 ===============

export async function getHabitLogs(userId: string, habitId?: string, date?: string): Promise<HabitLog[]> {
  if (!supabase) return []

  let query = supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", userId)

  if (habitId) {
    query = query.eq("habit_id", habitId)
  }

  if (date) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    query = query
      .gte("completed_at", startOfDay.toISOString())
      .lte("completed_at", endOfDay.toISOString())
  }

  const { data, error } = await query.order("completed_at", { ascending: false })

  if (error) {
    console.error("Error fetching habit logs:", error)
    return []
  }

  return data || []
}

export async function logHabitCompletion(log: Tables["habit_logs"]["Insert"]) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from("habit_logs")
    .insert(log)
    .select()
    .single()

  if (error) {
    console.error("Error logging habit completion:", error)
    return null
  }

  return data
}

export async function removeHabitLog(logId: string) {
  if (!supabase) return false

  const { error } = await supabase
    .from("habit_logs")
    .delete()
    .eq("id", logId)

  if (error) {
    console.error("Error removing habit log:", error)
    return false
  }

  return true
}

// =============== 社区功能 ===============

export async function getPosts(category?: string): Promise<Post[]> {
  if (!supabase) return []

  let query = supabase
    .from("posts")
    .select("*")

  if (category && category !== "all") {
    query = query.eq("category", category)
  }

  const { data, error } = await query.order("inserted_at", { ascending: false })

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  return data || []
}

export async function getPost(postId: string): Promise<Post | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single()

  if (error) {
    console.error("Error fetching post:", error)
    return null
  }

  return data
}

export async function createPost(post: Tables["posts"]["Insert"]) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from("posts")
    .insert(post)
    .select()
    .single()

  if (error) {
    console.error("Error creating post:", error)
    return null
  }

  return data
}

export async function getComments(postId: string): Promise<Comment[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("inserted_at", { ascending: true })

  if (error) {
    console.error("Error fetching comments:", error)
    return []
  }

  return data || []
}

export async function createComment(comment: Tables["comments"]["Insert"]) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from("comments")
    .insert(comment)
    .select()
    .single()

  if (error) {
    console.error("Error creating comment:", error)
    return null
  }

  return data
}

// =============== 奖励系统 ===============

export async function getRewards(): Promise<Reward[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from("rewards")
    .select("*")
    .eq("is_active", true)
    .order("points_required", { ascending: true })

  if (error) {
    console.error("Error fetching rewards:", error)
    return []
  }

  return data || []
}

export async function redeemReward(userId: string, rewardId: string, pointsSpent: number) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from("redemptions")
    .insert({
      user_id: userId,
      reward_id: rewardId,
      points_spent: pointsSpent,
      status: "pending"
    })
    .select()
    .single()

  if (error) {
    console.error("Error redeeming reward:", error)
    return null
  }

  return data
}

export async function getRedemptions(userId: string) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from("redemptions")
    .select(`
      *,
      rewards (*)
    `)
    .eq("user_id", userId)
    .order("redeemed_at", { ascending: false })

  if (error) {
    console.error("Error fetching redemptions:", error)
    return []
  }

  return data || []
}

// =============== 统计数据 ===============

export async function getUserStats(userId: string) {
  if (!supabase) return null

  // 获取习惯数量
  const { data: habits } = await supabase
    .from("habits")
    .select("id")
    .eq("user_id", userId)
    .eq("is_active", true)

  // 获取今日完成的习惯
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))
  const endOfDay = new Date(today.setHours(23, 59, 59, 999))

  const { data: todayLogs } = await supabase
    .from("habit_logs")
    .select("habit_id")
    .eq("user_id", userId)
    .gte("completed_at", startOfDay.toISOString())
    .lte("completed_at", endOfDay.toISOString())

  // 获取总积分（基于完成记录）
  const { data: allLogs } = await supabase
    .from("habit_logs")
    .select("id")
    .eq("user_id", userId)

  return {
    totalHabits: habits?.length || 0,
    completedToday: todayLogs?.length || 0,
    totalPoints: (allLogs?.length || 0) * 10, // 每次完成10分
    totalCompletions: allLogs?.length || 0
  }
} 