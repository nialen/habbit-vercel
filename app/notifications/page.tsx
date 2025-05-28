"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Bell, Target, MessageCircle, Calendar, Settings, Check, X } from "lucide-react"

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
    habit: "bg-orange-100 text-orange-600",
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
    <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">通知中心</h1>
        <p className="text-gray-600 text-lg">及时了解孩子的成长动态 🔔</p>
      </div>

      {/* 通知统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="card-hover bg-gradient-to-br from-blue-100 to-blue-50">
          <CardContent className="p-6 text-center">
            <Bell className="mx-auto mb-2 text-blue-500" size={32} />
            <p className="text-2xl font-bold text-blue-700">{notifications.length}</p>
            <p className="text-blue-600 text-sm">总通知</p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-orange-100 to-orange-50">
          <CardContent className="p-6 text-center">
            <Target className="mx-auto mb-2 text-orange-500" size={32} />
            <p className="text-2xl font-bold text-orange-700">{unreadCount}</p>
            <p className="text-orange-600 text-sm">未读消息</p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-green-100 to-green-50">
          <CardContent className="p-6 text-center">
            <Check className="mx-auto mb-2 text-green-500" size={32} />
            <p className="text-2xl font-bold text-green-700">{notifications.length - unreadCount}</p>
            <p className="text-green-600 text-sm">已读消息</p>
          </CardContent>
        </Card>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">最新通知</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
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
              className={`card-hover ${!notification.isRead ? "border-l-4 border-l-purple-500" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass}`}>
                    <Icon size={24} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{notification.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.isRead && <Badge className="bg-purple-500 hover:bg-purple-600">新</Badge>}
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      {notification.actionRequired && (
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                          立即处理
                        </Button>
                      )}
                      {!notification.isRead && (
                        <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
                          标记已读
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 通知设置 */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="text-gray-600" />
            通知设置
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">习惯打卡提醒</h4>
                <p className="text-sm text-gray-500">当孩子忘记打卡时发送提醒</p>
              </div>
              <Switch
                checked={settings.habitReminders}
                onCheckedChange={(checked) => setSettings({ ...settings, habitReminders: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">AI顾问回复</h4>
                <p className="text-sm text-gray-500">收到AI顾问新回复时通知</p>
              </div>
              <Switch
                checked={settings.advisorReplies}
                onCheckedChange={(checked) => setSettings({ ...settings, advisorReplies: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">活动更新</h4>
                <p className="text-sm text-gray-500">活动开始前和有新活动时提醒</p>
              </div>
              <Switch
                checked={settings.activityUpdates}
                onCheckedChange={(checked) => setSettings({ ...settings, activityUpdates: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">系统消息</h4>
                <p className="text-sm text-gray-500">成就获得、系统更新等消息</p>
              </div>
              <Switch
                checked={settings.systemMessages}
                onCheckedChange={(checked) => setSettings({ ...settings, systemMessages: checked })}
              />
            </div>

            <hr className="border-gray-200" />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">邮件通知</h4>
                <p className="text-sm text-gray-500">通过邮件接收重要通知</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">推送通知</h4>
                <p className="text-sm text-gray-500">在设备上显示推送通知</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {notifications.length === 0 && (
        <Card className="card-hover text-center py-12">
          <CardContent>
            <Bell className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">暂无通知</h3>
            <p className="text-gray-500">当有新的消息时，会在这里显示</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
