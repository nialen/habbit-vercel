"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

interface Post {
  id: number
  title: string
  content: string
  author: string
  avatar: string
  created_at: string
  comments_count: number
  likes_count: number
  category: string
  tags: string[]
  is_pinned?: boolean
}

const categories = [
  { id: "all", name: "全部", color: "bg-blue-100 text-blue-800" },
  { id: "habits", name: "习惯养成", color: "bg-green-100 text-green-800" },
  { id: "education", name: "教育心得", color: "bg-purple-100 text-purple-800" },
  { id: "activities", name: "亲子活动", color: "bg-orange-100 text-orange-800" },
  { id: "health", name: "健康成长", color: "bg-pink-100 text-pink-800" },
  { id: "psychology", name: "儿童心理", color: "bg-indigo-100 text-indigo-800" },
  { id: "qa", name: "问题求助", color: "bg-red-100 text-red-800" },
]

const mockPosts: Post[] = [
  {
    id: 1,
    title: "如何培养孩子的阅读习惯？",
    content: "我家孩子5岁了，总是不爱看书，有什么好的方法可以培养阅读兴趣吗？",
    author: "爱读书的妈妈",
    avatar: "/avatars/parent-1.svg",
    created_at: "2024-06-01T10:30:00Z",
    comments_count: 12,
    likes_count: 25,
    category: "habits",
    tags: ["阅读", "习惯培养"],
    is_pinned: true,
  },
  {
    id: 2,
    title: "分享一个超棒的亲子手工活动",
    content: "周末和孩子一起做了彩虹纸盘，孩子特别开心！材料简单，效果很棒。",
    author: "手工达人爸爸",
    avatar: "/avatars/parent-2.svg",
    created_at: "2024-06-01T09:15:00Z",
    comments_count: 8,
    likes_count: 18,
    category: "activities",
    tags: ["手工", "创意", "周末活动"],
  },
  {
    id: 3,
    title: "孩子不愿意分享玩具怎么办？",
    content: "3岁的宝宝最近特别不愿意和小朋友分享玩具，这是正常现象吗？",
    author: "新手妈妈小李",
    avatar: "/avatars/parent-3.svg",
    created_at: "2024-06-01T08:45:00Z",
    comments_count: 15,
    likes_count: 22,
    category: "psychology",
    tags: ["分享", "社交", "行为引导"],
  },
  {
    id: 4,
    title: "推荐几本适合6岁孩子的绘本",
    content: "最近给孩子买了几本绘本，效果不错，推荐给大家...",
    author: "绘本收藏家",
    avatar: "/avatars/parent-4.svg",
    created_at: "2024-05-31T20:30:00Z",
    comments_count: 6,
    likes_count: 14,
    category: "education",
    tags: ["绘本", "阅读推荐"],
  },
  {
    id: 5,
    title: "孩子挑食严重，营养跟不上",
    content: "我家宝宝特别挑食，只吃几样东西，担心营养不良，求助有经验的家长！",
    author: "焦虑的妈妈",
    avatar: "/avatars/parent-5.svg",
    created_at: "2024-05-31T18:20:00Z",
    comments_count: 20,
    likes_count: 16,
    category: "health",
    tags: ["挑食", "营养", "饮食习惯"],
  },
  {
    id: 6,
    title: "如何平衡工作和陪伴孩子的时间？",
    content: "作为职场妈妈，总觉得陪伴孩子的时间不够，大家都是怎么平衡的？",
    author: "职场妈妈Amy",
    avatar: "/avatars/parent-6.svg",
    created_at: "2024-05-31T16:10:00Z",
    comments_count: 18,
    likes_count: 28,
    category: "education",
    tags: ["时间管理", "工作平衡", "陪伴"],
  },
]

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "habits", tags: "" })
  const [showNewPostForm, setShowNewPostForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "请填写完整信息",
        description: "标题和内容不能为空",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const post: Post = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      author: "小明妈妈",
      avatar: "/avatars/parent-1.svg",
      created_at: new Date().toISOString(),
      comments_count: 0,
      likes_count: 0,
      category: newPost.category,
      tags: newPost.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    }

    setPosts([post, ...posts])
    setNewPost({ title: "", content: "", category: "habits", tags: "" })
    setShowNewPostForm(false)
    setIsLoading(false)

    toast({
      title: "发布成功！",
      description: "您的帖子已成功发布到社区",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "刚刚"
    if (diffInHours < 24) return `${diffInHours}小时前`
    if (diffInHours < 48) return "昨天"
    return date.toLocaleDateString()
  }

  const getCategoryInfo = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId) || categories[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 主内容区域 */}
      <div className="md:ml-64 pt-16 md:pt-0">
        <div className="min-h-screen flex items-start justify-center">
          <div className="w-full max-w-4xl px-6 py-8">
            {/* 页面标题 */}
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">💬</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">家长讨论区</h1>
                  <p className="text-gray-600 mt-1">分享育儿经验，交流成长心得</p>
                </div>
              </div>
            </div>

            {/* 搜索和发布 */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
              <div className="flex-1 relative">
                <Input
                  placeholder="搜索帖子、标签..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 h-12 text-base"
                />
                <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  search
                </span>
              </div>
              <Button
                onClick={() => setShowNewPostForm(!showNewPostForm)}
                className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-6 text-base"
              >
                <span className="material-icons text-sm mr-2">add</span>
                {showNewPostForm ? "取消" : "发布新帖"}
              </Button>
            </div>

            {/* 分类筛选 */}
            <div className="mb-8 bg-white p-4 rounded-xl shadow-sm max-w-3xl mx-auto">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`${
                      selectedCategory === category.id
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "hover:bg-blue-50 hover:border-blue-300"
                    } rounded-full text-sm px-5 py-2`}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* 发布新帖表单 */}
            {showNewPostForm && (
              <div className="max-w-3xl mx-auto mb-8">
                <Card className="border-blue-200 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 py-4">
                    <CardTitle className="text-blue-800 text-xl text-center">发布新帖</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <Input
                          placeholder="请输入帖子标题..."
                          value={newPost.title}
                          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                          className="text-lg font-medium h-12"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <select
                          value={newPost.category}
                          onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        >
                          {categories.slice(1).map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <Input
                          placeholder="标签（用逗号分隔）"
                          value={newPost.tags}
                          onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                          className="flex-1 h-12"
                        />
                      </div>
                      <Textarea
                        placeholder="分享您的育儿经验或提出问题..."
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        rows={5}
                        className="resize-none text-base"
                      />
                      <div className="flex gap-4 justify-center">
                        <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3">
                          {isLoading ? "发布中..." : "发布帖子"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowNewPostForm(false)}
                          className="hover:bg-gray-50 px-8 py-3"
                        >
                          取消
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 帖子列表 */}
            <div className="max-w-3xl mx-auto space-y-5">
              {filteredPosts.map((post) => {
                const categoryInfo = getCategoryInfo(post.category)

                return (
                  <Card
                    key={post.id}
                    className="hover:shadow-lg transition-all duration-200 border-gray-200 overflow-hidden"
                  >
                    <CardContent className="p-0">
                      <Link href={`/community/${post.id}`} className="block p-6 hover:bg-blue-50/40">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.author} />
                            <AvatarFallback>{post.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="font-medium text-gray-800">{post.author}</h3>
                              <span className="text-sm text-gray-500">·</span>
                              <span className="text-sm text-gray-500">{formatTime(post.created_at)}</span>
                              {post.is_pinned && (
                                <Badge variant="secondary" className="bg-red-100 text-red-800">
                                  置顶
                                </Badge>
                              )}
                              <Badge className={`${categoryInfo.color}`}>{categoryInfo.name}</Badge>
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">{post.title}</h2>

                            <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{post.content}</p>

                            {post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.map((tag, index) => (
                                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <span className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                                <span className="material-icons text-sm">thumb_up</span>
                                {post.likes_count}
                              </span>
                              <span className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                                <span className="material-icons text-sm">comment</span>
                                {post.comments_count}
                              </span>
                              <span className="flex items-center gap-1 ml-auto text-blue-500 hover:text-blue-600">
                                <span className="material-icons text-sm">arrow_forward</span>
                                查看详情
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-icons text-3xl text-gray-400">search_off</span>
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-3">暂无相关帖子</h3>
                <p className="text-gray-500">试试调整搜索条件或发布第一个帖子吧！</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
