import { NextRequest, NextResponse } from "next/server"
import { getHabitLogs, logHabitCompletion, removeHabitLog } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const habitId = searchParams.get("habitId")
    const date = searchParams.get("date")

    if (!userId) {
      return NextResponse.json({ error: "用户ID不能为空" }, { status: 400 })
    }

    const logs = await getHabitLogs(userId, habitId || undefined, date || undefined)
    return NextResponse.json({ logs })
  } catch (error) {
    console.error("获取习惯记录失败:", error)
    return NextResponse.json({ error: "获取习惯记录失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, habit_id, notes } = body

    if (!user_id || !habit_id) {
      return NextResponse.json({ error: "用户ID和习惯ID不能为空" }, { status: 400 })
    }

    const log = await logHabitCompletion({
      user_id,
      habit_id,
      notes,
      completed_at: new Date().toISOString()
    })

    if (!log) {
      return NextResponse.json({ error: "记录习惯完成失败" }, { status: 500 })
    }

    return NextResponse.json({ log }, { status: 201 })
  } catch (error) {
    console.error("记录习惯完成失败:", error)
    return NextResponse.json({ error: "记录习惯完成失败" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const logId = searchParams.get("id")

    if (!logId) {
      return NextResponse.json({ error: "记录ID不能为空" }, { status: 400 })
    }

    const success = await removeHabitLog(logId)

    if (!success) {
      return NextResponse.json({ error: "删除习惯记录失败" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("删除习惯记录失败:", error)
    return NextResponse.json({ error: "删除习惯记录失败" }, { status: 500 })
  }
}
