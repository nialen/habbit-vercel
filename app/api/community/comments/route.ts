import { NextRequest, NextResponse } from "next/server"
import { getComments, createComment } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")

    if (!postId) {
      return NextResponse.json({ error: "帖子ID不能为空" }, { status: 400 })
    }

    const comments = await getComments(postId)
    return NextResponse.json({ comments })
  } catch (error) {
    console.error("获取评论失败:", error)
    return NextResponse.json({ error: "获取评论失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { post_id, body: content, author } = body

    if (!post_id || !content || !author) {
      return NextResponse.json({ error: "帖子ID、内容和作者不能为空" }, { status: 400 })
    }

    const comment = await createComment({
      post_id,
      body: content,
      author
    })

    if (!comment) {
      return NextResponse.json({ error: "创建评论失败" }, { status: 500 })
    }

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error("创建评论失败:", error)
    return NextResponse.json({ error: "创建评论失败" }, { status: 500 })
  }
} 