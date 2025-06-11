import { NextRequest, NextResponse } from "next/server"
import { getPosts, createPost } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    const posts = await getPosts(category || undefined)
    return NextResponse.json({ posts })
  } catch (error) {
    console.error("获取帖子失败:", error)
    return NextResponse.json({ error: "获取帖子失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, body: content, author, category, tags } = body

    if (!title || !content || !author) {
      return NextResponse.json({ error: "标题、内容和作者不能为空" }, { status: 400 })
    }

    const post = await createPost({
      title,
      body: content,
      author,
      category: category || "general",
      tags: tags || []
    })

    if (!post) {
      return NextResponse.json({ error: "创建帖子失败" }, { status: 500 })
    }

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error("创建帖子失败:", error)
    return NextResponse.json({ error: "创建帖子失败" }, { status: 500 })
  }
} 