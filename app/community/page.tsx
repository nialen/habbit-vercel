"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PageLayout } from "@/components/page-layout"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

interface Post {
  id: string
  title: string
  body: string
  author: string
  author_name?: string
  inserted_at: string
  category: string
  tags: string[]
  likes_count?: number
}

const categories = [
  { id: "all", name: "全部", icon: "home", color: "text-gray-600" },
  { id: "habits", name: "习惯培养", icon: "assignment", color: "text-blue-600" },
  { id: "health", name: "健康成长", icon: "favorite", color: "text-red-500" },
  { id: "education", name: "教育经验", icon: "school", color: "text-green-600" },
  { id: "activities", name: "亲子活动", icon: "sports_esports", color: "text-purple-600" },
  { id: "general", name: "育儿交流", icon: "chat", color: "text-orange-600" },
]

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "habits", tags: "" })
  const [showNewPostForm, setShowNewPostForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const { user } = useAuth()

  // 加载帖子数据
  useEffect(() => {
    loadPosts()
  }, [selectedCategory])

  const loadPosts = async () => {
    setLoadingPosts(true)
    try {
      const categoryParam = selectedCategory === "all" ? "" : `?category=${selectedCategory}`
      const response = await fetch(`/api/community/posts${categoryParam}`)
      
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      } else {
        throw new Error('获取帖子失败')
      }
    } catch (error) {
      console.error('加载帖子失败:', error)
      toast({
        title: "加载失败",
        description: "无法加载社区帖子，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoadingPosts(false)
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能发布帖子",
        variant: "destructive",
      })
      return
    }
    
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "请填写完整信息",
        description: "标题和内容不能为空",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newPost.title,
          body: newPost.content,
          author: user.id,
          category: newPost.category,
          tags: newPost.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        }),
      })

      if (response.ok) {
        toast({
          title: "发布成功！",
          description: "您的帖子已成功发布到社区",
        })
        
        setNewPost({ title: "", content: "", category: "habits", tags: "" })
        setShowNewPostForm(false)
        
        // 重新加载帖子列表
        await loadPosts()
      } else {
        throw new Error('发布失败')
      }
    } catch (error) {
      console.error('发布帖子失败:', error)
      toast({
        title: "发布失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
    <PageLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">家长社区</h1>
          <p className="text-gray-600">分享育儿心得，交流成长经验 💬</p>
        </div>

        {/* 搜索栏 */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                search
              </span>
              <Input
                placeholder="搜索帖子标题、内容或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* 分类导航 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <span className={`material-icons text-sm ${category.color}`}>{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 发布帖子按钮 */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {getCategoryInfo(selectedCategory).name}
          </h2>
          <Button
            onClick={() => setShowNewPostForm(!showNewPostForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <span className="material-icons mr-2">add</span>
            发布帖子
          </Button>
        </div>

        {/* 发布帖子表单 */}
        {showNewPostForm && (
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle>发布新帖子</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">标题</label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="请输入帖子标题..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">内容</label>
                  <Textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="分享您的育儿经验或提出问题..."
                    rows={6}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">分类</label>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      {categories.slice(1).map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">标签（用逗号分隔）</label>
                    <Input
                      value={newPost.tags}
                      onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                      placeholder="例如：阅读, 习惯培养"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
                    {isLoading ? "发布中..." : "发布帖子"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewPostForm(false)}
                  >
                    取消
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* 加载状态 */}
        {loadingPosts && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">加载帖子中...</p>
            </div>
          </div>
        )}

        {/* 帖子列表 */}
        {!loadingPosts && (
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const categoryInfo = getCategoryInfo(post.category)
              return (
                <Card key={post.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="/avatars/default.svg" alt="作者头像" />
                        <AvatarFallback>{post.author_name?.[0] || "用"}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-900">
                            {post.author_name || "匿名用户"}
                          </span>
                          <Badge className={`${categoryInfo.color} bg-opacity-10`}>
                            {categoryInfo.name}
                          </Badge>
                          <span className="text-sm text-gray-500">{formatTime(post.inserted_at)}</span>
                        </div>

                        <Link href={`/community/${post.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                            {post.title}
                          </h3>
                        </Link>

                        <p className="text-gray-700 mb-3 line-clamp-3">
                          {post.body}
                        </p>

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-6">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
                            <span className="material-icons text-sm">thumb_up</span>
                            <span className="text-sm">{post.likes_count || 0}</span>
                          </button>

                          <Link href={`/community/${post.id}`}>
                            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
                              <span className="material-icons text-sm">comment</span>
                              <span className="text-sm">查看详情</span>
                            </button>
                          </Link>

                          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
                            <span className="material-icons text-sm">share</span>
                            <span className="text-sm">分享</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {filteredPosts.length === 0 && !loadingPosts && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">没有找到相关帖子</h3>
                <p className="text-gray-500">试试调整搜索条件或换个关键词</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
