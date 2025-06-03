import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isDemoMode } from '@/lib/app-mode'

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/auth/callback',
  '/auth/confirm',
  '/auth/reset-password',
]

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  
  // 演示模式：允许所有访问
  if (isDemoMode()) {
    return res
  }

  // 完整模式：需要认证
  const supabase = createMiddlewareClient({ req: request, res })

  // 检查当前会话
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 获取当前路径
  const path = new URL(request.url).pathname

  if (!session && !PUBLIC_ROUTES.includes(path)) {
    // 重定向到首页（包含登录界面）
    return NextResponse.redirect(new URL('/', request.url))
  }

  return res
}

// 配置需要运行中间件的路由
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * - api 路由
     * - _next 系统文件
     * - 静态文件 (public 文件夹)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.svg|avatars/|images/).*)',
  ],
} 