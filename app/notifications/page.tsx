"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { PageLayout } from "@/components/page-layout"
import { Bell, Target, MessageCircle, Calendar } from "lucide-react"

interface Notification {
  id: string
  type: "habit" | "advisor" | "activity" | "system"
  title: string
  message: string
  time: string
  isRead: boolean
  actionRequired?: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "habit",
      title: "打卡提醒",
      message: '小明还没有完成今天的"刷牙洗脸"习惯哦！',
      time: "2小时前",
      isRead: false,
      actionRequired: true,
    },
    {
      id: "2",
      type: "advisor",
      title: "AI顾问回复",
      message: '您关于"孩子不爱吃蔬菜"的咨询已有新的建议回复',
      time: "4小时前",
      isRead: false,
    },
    {
      id: "3",
      type: "activity",
      title: "活动提醒",
      message: '明天下午的"亲子阅读分享会"即将开始，记得准备好绘本哦！',
      time: "1天前",
      isRead: true,
    },
    {
      id: "4",
      type: "system",
      title: "系统消息",
      message: '恭喜！小明的"早睡早起"习惯已经坚持7天了，获得了"坚持之星"徽章！',
      time: "2天前",
      isRead: true,
    },
  ])

  const [settings, setSettings] = useState({
    habitReminders: true,
    advisorReplies: true,
    activityUpdates: true,
    systemMessages: true,
    emailNotifications: false,
    pushNotifications: true,
  })

  const typeIcons = {
    habit: Target,
    advisor: MessageCircle,
    activity: Calendar,
    system: Bell,
  }

  const typeColors = {
    habit: "bg-indigo-100 text-indigo-600",
    advisor: "bg-purple-100 text-purple-600",
    activity: "bg-blue-100 text-blue-600",
    system: "bg-green-100 text-green-600",
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      ),
    )
  }

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== notificationId))
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <PageLayout className="bg-zinc-50">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          通知中心
        </h1>
        <p className="text-gray-600">及时了解孩子的成长动态 🔔</p>
      </div>

      {/* 通知统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <span className="material-icons text-3xl text-blue-500 mb-2">notifications</span>
            <p className="text-2xl font-bold text-blue-800">{notifications.length}</p>
            <p className="text-sm text-blue-600">总通知</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="p-6 text-center">
            <span className="material-icons text-3xl text-indigo-500 mb-2">mark_email_unread</span>
            <p className="text-2xl font-bold text-indigo-800">{unreadCount}</p>
            <p className="text-sm text-indigo-600">未读消息</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6 text-center">
            <span className="material-icons text-3xl text-green-500 mb-2">mark_email_read</span>
            <p className="text-2xl font-bold text-green-800">{notifications.length - unreadCount}</p>
            <p className="text-sm text-green-600">已读消息</p>
          </CardContent>
        </Card>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">最新通知</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white disabled:hover:bg-transparent disabled:text-gray-500 disabled:border-gray-300"
          >
            <span className="material-icons mr-2 text-sm">done_all</span>
            全部已读
          </Button>
        </div>
      </div>

      {/* 通知列表 */}
      <div className="space-y-4 mb-8">
        {notifications.map((notification) => {
          const Icon = typeIcons[notification.type]
          const colorClass = typeColors[notification.type]

          return (
            <Card
              key={notification.id}
              className={`card-modern hover:shadow-lg transition-shadow duration-200 ${!notification.isRead ? "border-l-4 border-l-indigo-500" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass}`}>
                    <Icon size={24} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.isRead && <Badge className="bg-indigo-500 hover:bg-indigo-600">新</Badge>}
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      {notification.actionRequired && (
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                          <span className="material-icons mr-1 text-sm">play_arrow</span>
                          立即处理
                        </Button>
                      )}
                      {!notification.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                        >
                          <span className="material-icons mr-1 text-sm">done</span>
                          标记已读
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <span className="material-icons text-sm">delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📬</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">暂无通知</h3>
          <p className="text-gray-500">当有新的通知时，我们会及时提醒您</p>
        </div>
      )}

      {/* 通知设置 */}
      <Card className="mt-8 card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="material-icons text-blue-500">settings</span>
            通知设置
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 mb-3">消息类型</h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-icons text-indigo-500">assignment</span>
                  <span className="text-gray-700">习惯提醒</span>
                </div>
                <Switch
                  checked={settings.habitReminders}
                  onCheckedChange={(checked) => setSettings({ ...settings, habitReminders: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-icons text-purple-500">psychology</span>
                  <span className="text-gray-700">AI顾问回复</span>
                </div>
                <Switch
                  checked={settings.advisorReplies}
                  onCheckedChange={(checked) => setSettings({ ...settings, advisorReplies: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-icons text-blue-500">event</span>
                  <span className="text-gray-700">活动更新</span>
                </div>
                <Switch
                  checked={settings.activityUpdates}
                  onCheckedChange={(checked) => setSettings({ ...settings, activityUpdates: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-icons text-green-500">info</span>
                  <span className="text-gray-700">系统消息</span>
                </div>
                <Switch
                  checked={settings.systemMessages}
                  onCheckedChange={(checked) => setSettings({ ...settings, systemMessages: checked })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 mb-3">推送方式</h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-icons text-orange-500">email</span>
                  <span className="text-gray-700">邮件通知</span>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-icons text-red-500">notifications_active</span>
                  <span className="text-gray-700">推送通知</span>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <span className="material-icons mr-2">save</span>
              保存设置
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
