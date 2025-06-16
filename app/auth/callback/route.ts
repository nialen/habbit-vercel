import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  console.log('Auth callback triggered')
  
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  // 如果有错误，重定向到错误页面
  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(error)}`)
  }

  if (code) {
    console.log('Processing auth code:', code.substring(0, 10) + '...')
    
    const supabase = await createClient()
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent('登录失败，请重试')}`)
    }
    
    if (data.user) {
      console.log('User logged in successfully:', data.user.email)
      
      // 检查是否需要创建用户资料（社交登录的新用户）
      try {
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', data.user.id)
          .single()

        // 如果用户资料不存在，创建默认资料
        if (!existingProfile && !profileCheckError) {
          console.log('Creating new user profile for:', data.user.email)
          
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata?.full_name || 
                    data.user.user_metadata?.name || 
                    data.user.user_metadata?.preferred_username || 
                    data.user.email?.split('@')[0] ||
                    '新用户',
              child_name: '小宝贝', // 不能为空字符串，必须符合 NOT NULL 约束
              child_age: 5, // 不能为0，必须符合业务逻辑
            })

          if (profileError) {
            console.error('❌ OAuth回调创建用户资料错误:', {
              message: profileError.message,
              details: profileError.details,
              hint: profileError.hint,
              code: profileError.code,
              userId: data.user.id,
              email: data.user.email
            })
            // 即使创建用户资料失败，也继续登录流程
          } else {
            console.log('✅ OAuth回调成功创建用户资料')
          }
        } else if (existingProfile) {
          console.log('User profile already exists')
        }
      } catch (profileCheckError) {
        console.error('Error checking user profile:', profileCheckError)
        // 继续登录流程，不要因为用户资料错误而中断
      }

      // 确定重定向URL
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      let redirectUrl: string
      if (isLocalEnv) {
        redirectUrl = `${origin}${next}`
      } else if (forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`
      } else {
        redirectUrl = `${origin}${next}`
      }

      console.log('Redirecting to:', redirectUrl)
      
      // 创建重定向响应，并设置缓存控制头
      const response = NextResponse.redirect(redirectUrl)
      response.headers.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      
      return response
    }
  }

  console.log('No valid auth code, redirecting to auth page')
  // return the user to auth page with error
  return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent('认证失败，请重新登录')}`)
}
