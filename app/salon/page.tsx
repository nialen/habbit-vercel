"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Calendar, Clock, Users, Plus, MessageCircle, Heart, Share2 } from "lucide-react"

interface SalonEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  organizer: string
  participants: number
  maxParticipants: number
  tags: string[]
  isRegistered: boolean
}

export default function SalonPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [events, setEvents] = useState<SalonEvent[]>([
    {
      id: "1",
      title: "亲子阅读分享会",
      description: "一起分享优秀的儿童绘本，交流阅读心得，培养孩子的阅读兴趣。",
      date: "2024-01-20",
      time: "14:00-16:00",
      location: "杭州市图书馆儿童阅览室",
      organizer: "小明妈妈",
      participants: 8,
      maxParticipants: 15,
      tags: ["阅读", "分享", "室内"],
      isRegistered: false,
    },
    {
      id: "2",
      title: "户外自然探索",
      description: "带孩子们到西湖边观察自然，学习植物知识，培养观察力和好奇心。",
      date: "2024-01-22",
      time: "09:00-11:30",
      location: "西湖公园",
      organizer: "小红爸爸",
      participants: 12,
      maxParticipants: 20,
      tags: ["户外", "自然", "探索"],
      isRegistered: true,
    },
  ])

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    maxParticipants: 10,
    tags: "",
  })

  const toggleRegistration = (eventId: string) => {
    setEvents(
      events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              isRegistered: !event.isRegistered,
              participants: event.isRegistered ? event.participants - 1 : event.participants + 1,
            }
          : event,
      ),
    )
  }

  const createEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date || !newEvent.time) return

    const event: SalonEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      organizer: "我",
      participants: 1,
      maxParticipants: newEvent.maxParticipants,
      tags: newEvent.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      isRegistered: true,
    }

    setEvents([event, ...events])
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      maxParticipants: 10,
      tags: "",
    })
    setShowCreateForm(false)
  }

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">线下沙龙</h1>
        <p className="text-gray-600 text-lg">连接同城家长，分享育儿经验 🤝</p>
      </div>

      {/* 创建活动按钮 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">近期活动</h2>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-purple-500 hover:bg-purple-600">
          <Plus size={16} className="mr-2" />
          发起活动
        </Button>
      </div>

      {/* 创建活动表单 */}
      {showCreateForm && (
        <Card className="card-hover mb-6 border-purple-200">
          <CardHeader>
            <CardTitle>发起新活动</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">活动标题</label>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="例如：亲子手工制作分享会"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">活动描述</label>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="详细描述活动内容、目标和注意事项..."
                  className="rounded-xl min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">活动日期</label>
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">活动时间</label>
                  <Input
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    placeholder="例如：14:00-16:00"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">活动地点</label>
                <Input
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="详细地址"
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">最大参与人数</label>
                  <Input
                    type="number"
                    value={newEvent.maxParticipants}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, maxParticipants: Number.parseInt(e.target.value) || 10 })
                    }
                    min="1"
                    max="50"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">标签（用逗号分隔）</label>
                  <Input
                    value={newEvent.tags}
                    onChange={(e) => setNewEvent({ ...newEvent, tags: e.target.value })}
                    placeholder="例如：手工,创意,室内"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={createEvent} className="bg-purple-500 hover:bg-purple-600">
                  发布活动
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  取消
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 活动列表 */}
      <div className="space-y-6">
        {events.map((event) => (
          <Card key={event.id} className="card-hover">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-3">{event.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Heart size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users size={16} />
                      <span>
                        {event.participants}/{event.maxParticipants} 人
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">发起人：{event.organizer}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageCircle size={16} className="mr-1" />
                        评论
                      </Button>
                      <Button
                        onClick={() => toggleRegistration(event.id)}
                        className={
                          event.isRegistered ? "bg-gray-500 hover:bg-gray-600" : "bg-purple-500 hover:bg-purple-600"
                        }
                        disabled={!event.isRegistered && event.participants >= event.maxParticipants}
                      >
                        {event.isRegistered ? "已报名" : "立即报名"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 地图展示区域 */}
      <Card className="card-hover mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="text-purple-500" />
            杭州活动地图
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto mb-2 text-purple-500" size={48} />
              <p className="text-gray-600">地图功能开发中...</p>
              <p className="text-sm text-gray-500">将显示杭州地区的活动位置</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 温馨提示 */}
      <Card className="card-hover mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">参与活动须知</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• 请提前确认活动时间和地点</li>
                <li>• 带好必要的物品和材料</li>
                <li>• 注意孩子的安全，全程陪同</li>
                <li>• 如有变动请及时联系组织者</li>
                <li>• 保持良好的沟通和互助精神</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
