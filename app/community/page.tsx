"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
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
        throw new Error("获取帖子失败")
      }
    } catch (error) {
      console.error("加载帖子失败:", error)
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
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        throw new Error("发布失败")
      }
    } catch (error) {
      console.error("发布帖子失败:", error)
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
    <PageLayout bg="bg-kidsSecond-100/50">
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-kidsPrimary-500 to-kidsPrimary-700 text-transparent bg-clip-text mb-4 flex items-center justify-center gap-3">
            <span className="text-5xl">🌟</span>
            家长社区
            <span className="text-5xl">🌟</span>
          </h1>
          <p className="text-lg text-kidsPrimary-600 font-medium">
            分享育儿心得，交流成长经验，一起陪伴孩子快乐成长 💝
          </p>
        </div>

        {/* 搜索栏 */}
        <div className="card-modern p-6">
          <div className="relative">
            <span className="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-kidsPrimary-500 text-xl">
              search
            </span>
            <input
              placeholder="🔍 搜索帖子标题、内容或标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-modern w-full pl-12 text-lg"
            />
          </div>
        </div>

        {/* 分类导航 */}
        <div className="card-modern p-6">
          <h3 className="text-lg font-bold text-kidsPrimary-700 mb-4 flex items-center gap-2">
            <span className="text-xl">📚</span>
            选择话题分类
          </h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`button-modern-category flex items-center gap-2 ${
                  selectedCategory === category.id ? "active" : ""
                }`}
              >
                <span className={`material-icons text-sm`}>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* 发布帖子按钮 */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-kidsPrimary-700 flex items-center gap-2">
            <span className="text-2xl">
              {selectedCategory === "all"
                ? "🌈"
                : selectedCategory === "habits"
                  ? "📖"
                  : selectedCategory === "health"
                    ? "💪"
                    : selectedCategory === "education"
                      ? "🎓"
                      : selectedCategory === "activities"
                        ? "🎨"
                        : "💬"}
            </span>
            {getCategoryInfo(selectedCategory).name}
          </h2>
          <button
            onClick={() => setShowNewPostForm(!showNewPostForm)}
            className="button-modern flex items-center gap-2"
          >
            <span className="material-icons">add</span>
            发布帖子
          </button>
        </div>

        {/* 发布帖子表单 */}
        {showNewPostForm && (
          <div className="card-modern p-8 border-kidsPrimary-300">
            <h3 className="text-2xl font-bold text-kidsPrimary-700 mb-6 flex items-center gap-3">
              <span className="text-3xl">✏️</span>
              发布新帖子
              <span className="text-3xl">📝</span>
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-bold text-kidsPrimary-700 mb-3 flex items-center gap-2">
                  <span>📌</span>
                  标题
                </label>
                <input
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="请输入一个吸引人的标题..."
                  required
                  className="input-modern w-full"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-kidsPrimary-700 mb-3 flex items-center gap-2">
                  <span>💭</span>
                  内容
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="分享您的育儿经验、困惑或建议吧..."
                  rows={6}
                  required
                  className="input-modern w-full resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-bold text-kidsPrimary-700 mb-3 flex items-center gap-2">
                    <span>📂</span>
                    分类
                  </label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="input-modern w-full"
                  >
                    {categories.slice(1).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-bold text-kidsPrimary-700 mb-3 flex items-center gap-2">
                    <span>🏷️</span>
                    标签（用逗号分隔）
                  </label>
                  <input
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    placeholder="例如：阅读, 习惯培养, 健康"
                    className="input-modern w-full"
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="button-modern disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      发布中...
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      发布帖子
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPostForm(false)}
                  className="button-modern-category px-6 py-3"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 加载状态 */}
        {loadingPosts && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="text-6xl animate-bounce mb-4">🌈</div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-kidsPrimary-200 border-t-kidsPrimary-500 mx-auto mb-4"></div>
              <p className="text-xl text-kidsPrimary-600 font-semibold">正在加载精彩内容...</p>
              <p className="text-kidsPrimary-500 mt-2">稍等一下哦~ ✨</p>
            </div>
          </div>
        )}

        {/* 帖子列表 */}
        {!loadingPosts && (
          <div className="space-y-6">
            {filteredPosts.map((post) => {
              const categoryInfo = getCategoryInfo(post.category)
              const categoryEmoji =
                post.category === "habits"
                  ? "📖"
                  : post.category === "health"
                    ? "💪"
                    : post.category === "education"
                      ? "🎓"
                      : post.category === "activities"
                        ? "🎨"
                        : "💬"
              return (
                <div key={post.id} className="card-modern p-6">
                  <div className="flex items-start gap-4">
                    <div className="kids-avatar w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-kidsPrimary-600">
                      {post.author_name?.[0] || "👤"}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-bold text-kidsPrimary-700 text-lg">{post.author_name || "匿名用户"}</span>
                        <span className="kids-badge flex items-center gap-1">
                          <span>{categoryEmoji}</span>
                          {categoryInfo.name}
                        </span>
                        <span className="text-sm text-kidsPrimary-500 bg-kidsPrimary-50 px-2 py-1 rounded-full">
                          {formatTime(post.inserted_at)}
                        </span>
                      </div>

                      <Link href={`/community/${post.id}`}>
                        <h3 className="text-xl font-bold text-kidsPrimary-800 mb-3 hover:text-kidsPrimary-600 cursor-pointer transition-colors duration-200">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-kidsPrimary-700 mb-4 line-clamp-3 text-base leading-relaxed">{post.body}</p>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-kidsPurple-100 text-kidsPurple-700 text-sm rounded-full border border-kidsPurple-200 font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-6">
                        <button className="button-modern-icon flex items-center gap-2  transition-colors duration-200  px-3 py-2 rounded-full">
                          <span className="text-lg">👍</span>
                          <span className="font-medium">{post.likes_count || 0}</span>
                        </button>

                        <Link href={`/community/${post.id}`}>
                          <button className="button-modern-icon flex items-center gap-2  transition-colors duration-200  px-3 py-2 rounded-full">
                            <span className="text-lg">💬</span>
                            <span className="font-medium">查看详情</span>
                          </button>
                        </Link>

                        <button className="button-modern-icon flex items-center gap-2  transition-colors duration-200  px-3 py-2 rounded-full">
                          <span className="text-lg">🔗</span>
                          <span className="font-medium">分享</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {filteredPosts.length === 0 && !loadingPosts && (
              <div className="kids-card p-12 text-center">
                <div className="text-8xl mb-6 animate-bounce">🎈</div>
                <h3 className="text-3xl font-bold text-kidsPrimary-700 mb-4 flex items-center justify-center gap-2">
                  {searchQuery ? (
                    <>
                      <span>🔍</span>
                      没有找到相关内容
                      <span>🔍</span>
                    </>
                  ) : (
                    <>
                      <span>🌟</span>
                      这里还很安静呢~
                      <span>🌟</span>
                    </>
                  )}
                </h3>
                <p className="text-lg text-kidsPrimary-600 mb-8 leading-relaxed">
                  {searchQuery
                    ? "试试调整搜索条件或换个关键词，也许会有意外收获哦 ✨"
                    : "还没有人分享内容，快来当第一个分享者，让这里热闹起来吧 🎉"}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="button-modern-category px-8 py-4 text-lg">
                      <span className="mr-2">🔄</span>
                      清除搜索，查看全部
                    </button>
                  )}
                  <button onClick={() => setShowNewPostForm(true)} className="button-modern text-lg px-8 py-4">
                    <span className="mr-2">✨</span>
                    {searchQuery ? "分享新内容" : "发布第一篇帖子"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
