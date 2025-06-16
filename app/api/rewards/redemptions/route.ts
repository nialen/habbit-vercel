import { NextRequest, NextResponse } from "next/server"
import { getRedemptions } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "用户ID不能为空" }, { status: 400 })
    }

    const redemptions = await getRedemptions(userId)
    return NextResponse.json({ redemptions })
  } catch (error) {
    console.error("获取兑换记录失败:", error)
    return NextResponse.json({ error: "获取兑换记录失败" }, { status: 500 })
  }
}
