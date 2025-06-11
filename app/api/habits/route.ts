import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getHabits, createHabit, updateHabit, deleteHabit } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "用户ID不能为空" }, { status: 400 })
    }

    const habits = await getHabits(userId)
    return NextResponse.json({ habits })
  } catch (error) {
    console.error("获取习惯失败:", error)
    return NextResponse.json({ error: "获取习惯失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, name, icon, category, description } = body

    if (!user_id || !name) {
      return NextResponse.json({ error: "用户ID和习惯名称不能为空" }, { status: 400 })
    }

    const habit = await createHabit({
      user_id,
      name,
      icon: icon || "⭐",
      category: category || "健康",
      description
    })

    if (!habit) {
      return NextResponse.json({ error: "创建习惯失败" }, { status: 500 })
    }

    return NextResponse.json({ habit }, { status: 201 })
  } catch (error) {
    console.error("创建习惯失败:", error)
    return NextResponse.json({ error: "创建习惯失败" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "习惯ID不能为空" }, { status: 400 })
    }

    const habit = await updateHabit(id, updates)

    if (!habit) {
      return NextResponse.json({ error: "更新习惯失败" }, { status: 500 })
    }

    return NextResponse.json({ habit })
  } catch (error) {
    console.error("更新习惯失败:", error)
    return NextResponse.json({ error: "更新习惯失败" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const habitId = searchParams.get("id")

    if (!habitId) {
      return NextResponse.json({ error: "习惯ID不能为空" }, { status: 400 })
    }

    const success = await deleteHabit(habitId)

    if (!success) {
      return NextResponse.json({ error: "删除习惯失败" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("删除习惯失败:", error)
    return NextResponse.json({ error: "删除习惯失败" }, { status: 500 })
  }
} 