import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl">认证错误</CardTitle>
          <p className="text-sm text-muted-foreground">
            认证过程中出现了问题，请重试登录
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link href="/login">返回登录</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 