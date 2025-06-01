"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PostPage() {
  const params = useParams()
  const postId = params.id as string
  const { toast } = useToast()

  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 获取帖子详情
  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author: author(id, email)
      `)
      .eq('id', postId)
      .single()

    if (error) {
      console.error('Error fetching post:', error)
      return
    }

    setPost(data)
  }

  // 获取评论列表
  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        author: author(id, email)
      `)
      .eq('post_id', postId)
      .order('inserted_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      return
    }

    setComments(data || [])
  }

  // 发布新评论
  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "请输入评论内容",
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
        description: "发表评论需要登录账号",
        variant: "destructive"
      })
      setIsSubmitting(false)
      return
    }

    const { error: commentError } = await supabase
      .from('comments')
      .insert([
        {
          post_id: postId,
          body: newComment.trim(),
          author: user.id
        }
      ])

    if (commentError) {
      toast({
        title: "发布失败",
        description: "请稍后重试",
        variant: "destructive"
      })
    } else {
      setNewComment("")
      await fetchComments()
    }

    setIsSubmitting(false)
  }

  // 初始加载数据
  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [postId])

  // 订阅实时评论更新
  useEffect(() => {
    const channel = supabase
      .channel('comments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`
        },
        (payload) => {
          fetchComments()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [postId])

  if (!post) {
    return <div className="container mx-auto py-12 text-center">加载中...</div>
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 帖子内容 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={`/avatars/parent-${parseInt(post.author.id.slice(-1), 16) % 8 + 1}.png`} />
              <AvatarFallback>家长</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{post.title}</h1>
              <div className="mt-1 text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.inserted_at), { locale: zhCN, addSuffix: true })}
              </div>
            </div>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{post.body}</p>
        </div>

        {/* 评论区 */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <Textarea
              placeholder="写下你的评论..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="mt-3 flex justify-end">
              <Button 
                onClick={handleSubmitComment}
                disabled={isSubmitting}
              >
                {isSubmitting ? "发布中..." : "发布评论"}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`/avatars/parent-${parseInt(comment.author.id.slice(-1), 16) % 8 + 1}.png`} />
                    <AvatarFallback>家长</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(comment.inserted_at), { locale: zhCN, addSuffix: true })}
                    </div>
                    <p className="mt-1 text-gray-700">{comment.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 