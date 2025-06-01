"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"

// 模拟帖子数据
const mockPost = {
  id: "1",
  title: "如何培养孩子的阅读习惯？",
  content:
    "我家孩子5岁了，总是不爱看书，有什么好的方法可以培养阅读兴趣吗？\n\n我尝试过给他买各种绘本，但他看一会就不感兴趣了。也试过带他去图书馆，效果也不是很好。\n\n有经验的家长能分享一些实用的方法吗？谢谢大家！",
  author: "爱读书的妈妈",
  avatar: "/avatars/parent-1.svg",
  created_at: "2024-06-01T10:30:00Z",
  comments_count: 12,
  likes_count: 25,
  category: "habits",
  tags: ["阅读", "习惯培养"],
}

// 模拟评论数据
const mockComments = [
  {
    id: "c1",
    content:
      "我觉得可以从孩子感兴趣的主题入手，比如恐龙、宇宙或者动物，找相关的绘本，边看边和孩子互动，问他问题，让他参与进来。",
    author: "经验妈妈",
    avatar: "/avatars/parent-2.svg",
    created_at: "2024-06-01T11:15:00Z",
    likes: 8,
    replies: [
      {
        id: "r1",
        content: "非常赞同这个方法！我家孩子就是从恐龙书开始爱上阅读的。",
        author: "恐龙迷爸爸",
        avatar: "/avatars/parent-3.svg",
        created_at: "2024-06-01T12:30:00Z",
      },
    ],
  },
  {
    id: "c2",
    content:
      "我们家的经验是固定阅读时间，每天睡前20分钟是阅读时间，久而久之就养成习惯了。另外，家长以身作则也很重要，孩子看到你爱读书，他也会模仿。",
    author: "阅读达人",
    avatar: "/avatars/parent-4.svg",
    created_at: "2024-06-01T13:45:00Z",
    likes: 12,
    replies: [],
  },
  {
    id: "c3",
    content: "可以尝试有声绘本，有些孩子对声音更敏感。也可以让孩子参与讲故事，问他'接下来会发生什么'，激发想象力。",
    author: "创意妈妈",
    avatar: "/avatars/parent-5.svg",
    created_at: "2024-06-01T15:20:00Z",
    likes: 5,
    replies: [],
  },
]

const categories = [
  { id: "all", name: "全部", color: "bg-blue-100 text-blue-800" },
  { id: "habits", name: "习惯养成", color: "bg-green-100 text-green-800" },
  { id: "education", name: "教育心得", color: "bg-purple-100 text-purple-800" },
  { id: "activities", name: "亲子活动", color: "bg-orange-100 text-orange-800" },
  { id: "health", name: "健康成长", color: "bg-pink-100 text-pink-800" },
  { id: "psychology", name: "儿童心理", color: "bg-indigo-100 text-indigo-800" },
  { id: "qa", name: "问题求助", color: "bg-red-100 text-red-800" },
]

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState(mockComments)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(mockPost.likes_count)

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { locale: zhCN, addSuffix: true })
  }

  const getCategoryInfo = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId) || categories[0]
  }

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      toast({
        title: "评论不能为空",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newComment = {
      id: `c${Date.now()}`,
      content: commentText,
      author: "小明妈妈",
      avatar: "/avatars/parent-1.svg",
      created_at: new Date().toISOString(),
      likes: 0,
      replies: [],
    }

    setComments([...comments, newComment])
    setCommentText("")
    setIsSubmitting(false)

    toast({
      title: "评论成功",
      description: "您的评论已发布",
    })
  }

  const handleSubmitReply = async (commentId: string) => {
    if (!replyText.trim()) {
      toast({
        title: "回复不能为空",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newReply = {
      id: `r${Date.now()}`,
      content: replyText,
      author: "小明妈妈",
      avatar: "/avatars/parent-1.svg",
      created_at: new Date().toISOString(),
    }

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply],
        }
      }
      return comment
    })

    setComments(updatedComments)
    setReplyText("")
    setReplyTo(null)
    setIsSubmitting(false)

    toast({
      title: "回复成功",
      description: "您的回复已发布",
    })
  }

  const handleLikePost = () => {
    if (liked) {
      setLikesCount(likesCount - 1)
    } else {
      setLikesCount(likesCount + 1)
    }
    setLiked(!liked)
  }

  const categoryInfo = getCategoryInfo(mockPost.category)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 返回按钮 */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <span className="material-icons text-sm mr-1">arrow_back</span>
            返回讨论区
          </Button>
        </div>

        {/* 帖子详情 */}
        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={mockPost.avatar || "/placeholder.svg"} alt={mockPost.author} />
                <AvatarFallback>{mockPost.author[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-800">{mockPost.author}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{formatTime(mockPost.created_at)}</span>
                  <Badge className={categoryInfo.color}>{categoryInfo.name}</Badge>
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">{mockPost.title}</h1>

            <div className="prose prose-blue max-w-none mb-6">
              {mockPost.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700">
                  {paragraph}
                </p>
              ))}
            </div>

            {mockPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {mockPost.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikePost}
                className={`flex items-center gap-1 ${
                  liked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="material-icons text-sm">{liked ? "favorite" : "favorite_border"}</span>
                <span>{likesCount} 赞</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById("comment-box")?.focus()}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
              >
                <span className="material-icons text-sm">comment</span>
                <span>{comments.length} 评论</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 ml-auto"
              >
                <span className="material-icons text-sm">share</span>
                <span>分享</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 评论区 */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">评论 ({comments.length})</h2>

          {/* 评论输入框 */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/avatars/parent-1.svg" alt="我" />
                  <AvatarFallback>我</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    id="comment-box"
                    placeholder="分享你的看法..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                    className="mb-3 resize-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmitComment}
                      disabled={isSubmitting || !commentText.trim()}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {isSubmitting ? "发布中..." : "发表评论"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 评论列表 */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                      <AvatarFallback>{comment.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-800">{comment.author}</h3>
                        <span className="text-xs text-gray-500">{formatTime(comment.created_at)}</span>
                      </div>
                      <p className="text-gray-700 mb-3">{comment.content}</p>
                      <div className="flex items-center gap-4 mb-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 p-0 h-auto"
                        >
                          <span className="material-icons text-sm">thumb_up</span>
                          <span>{comment.likes}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 p-0 h-auto"
                        >
                          <span className="material-icons text-sm">reply</span>
                          <span>回复</span>
                        </Button>
                      </div>

                      {/* 回复列表 */}
                      {comment.replies.length > 0 && (
                        <div className="pl-4 border-l-2 border-gray-100 space-y-3 mb-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={reply.avatar || "/placeholder.svg"} alt={reply.author} />
                                <AvatarFallback>{reply.author[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-gray-800 text-sm">{reply.author}</h4>
                                  <span className="text-xs text-gray-500">{formatTime(reply.created_at)}</span>
                                </div>
                                <p className="text-gray-700 text-sm">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 回复输入框 */}
                      {replyTo === comment.id && (
                        <div className="flex gap-2 items-start mt-3">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src="/avatars/parent-1.svg" alt="我" />
                            <AvatarFallback>我</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <Textarea
                              placeholder={`回复 ${comment.author}...`}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={2}
                              className="mb-2 resize-none text-sm"
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setReplyTo(null)
                                  setReplyText("")
                                }}
                                className="text-xs"
                              >
                                取消
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSubmitReply(comment.id)}
                                disabled={isSubmitting || !replyText.trim()}
                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                              >
                                {isSubmitting ? "回复中..." : "回复"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {comments.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-2xl text-gray-400">chat</span>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">暂无评论</h3>
              <p className="text-gray-500 text-sm">来发表第一条评论吧！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
