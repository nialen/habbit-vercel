"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import Link from "next/link"

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // 获取帖子列表
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        comments: comments(count),
        author: author(id, email)
      `)
      .order('inserted_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      return
    }

    setPosts(data || [])
    setIsLoading(false)
  }

  // 发布新帖子
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "请填写完整内容",
        description: "标题和内容都不能为空",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      toast({
        title: "请先登录",
        description: "发帖需要登录账号",
        variant: "destructive"
      })
      setIsSubmitting(false)
      return
    }

    const { error: postError } = await supabase
      .from('posts')
      .insert([
        {
          title: title.trim(),
          body: content.trim(),
          author: user.id
        }
      ])

    if (postError) {
      toast({
        title: "发布失败",
        description: "请稍后重试",
        variant: "destructive"
      })
    } else {
      toast({
        title: "发布成功",
        description: "帖子已发布到社区"
      })
      setTitle("")
      setContent("")
      fetchPosts()
    }

    setIsSubmitting(false)
  }

  // 初始加载帖子
  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">家长互动区</h1>
        <Drawer>
          <DrawerTrigger asChild>
            <Button>发布新帖子</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>发布新帖子</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 pb-8">
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="输入标题"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="分享你的育儿经验和困惑..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={6}
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "发布中..." : "发布"}
                  </Button>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {isLoading ? (
        <div className="text-center py-12">加载中...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          还没有帖子，来发布第一篇吧！
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              href={`/community/${post.id}`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4"
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={`/avatars/parent-${parseInt(post.author.id.slice(-1), 16) % 8 + 1}.png`} />
                  <AvatarFallback>家长</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                  <p className="mt-1 text-gray-500 text-sm line-clamp-2">{post.body}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <span>{formatDistanceToNow(new Date(post.inserted_at), { locale: zhCN, addSuffix: true })}</span>
                    <span className="mx-2">·</span>
                    <span>{post.comments[0].count || 0} 条评论</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 