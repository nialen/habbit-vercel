import { NextRequest, NextResponse } from "next/server"
import { getRewards, redeemReward, getRedemptions } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const rewards = await getRewards()
    return NextResponse.json({ rewards })
  } catch (error) {
    console.error("获取奖励列表失败:", error)
    return NextResponse.json({ error: "获取奖励列表失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, reward_id, points_spent } = body

    if (!user_id || !reward_id || !points_spent) {
      return NextResponse.json({ error: "用户ID、奖励ID和积分不能为空" }, { status: 400 })
    }

    const redemption = await redeemReward(user_id, reward_id, points_spent)

    if (!redemption) {
      return NextResponse.json({ error: "兑换奖励失败" }, { status: 500 })
    }

    return NextResponse.json({ redemption }, { status: 201 })
  } catch (error) {
    console.error("兑换奖励失败:", error)
    return NextResponse.json({ error: "兑换奖励失败" }, { status: 500 })
  }
}
