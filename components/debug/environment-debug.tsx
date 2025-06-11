'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, Copy, Eye, EyeOff } from 'lucide-react'
import { getAppMode, getAppEnvironment, isSupabaseConfigured } from '@/lib/app-mode'

interface EnvironmentInfo {
  name: string
  value: string | undefined
  isSensitive?: boolean
  isRequired?: boolean
}

export function EnvironmentDebug() {
  const [showSensitive, setShowSensitive] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // 环境变量配置
  const envVars: EnvironmentInfo[] = [
    { name: 'NODE_ENV', value: process.env.NODE_ENV, isRequired: true },
    { name: 'NEXT_PUBLIC_APP_MODE', value: process.env.NEXT_PUBLIC_APP_MODE, isRequired: true },
    { name: 'NEXT_PUBLIC_APP_ENV', value: process.env.NEXT_PUBLIC_APP_ENV, isRequired: true },
    { name: 'NEXT_PUBLIC_APP_URL', value: process.env.NEXT_PUBLIC_APP_URL },
    { name: 'NEXT_PUBLIC_SUPABASE_URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL, isSensitive: true, isRequired: true },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, isSensitive: true, isRequired: true },
    { name: 'NEXT_PUBLIC_ENABLE_ANALYTICS', value: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS },
    { name: 'NEXT_PUBLIC_PLAUSIBLE_DOMAIN', value: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN },
    { name: 'NEXT_PUBLIC_ENABLE_DEBUG', value: process.env.NEXT_PUBLIC_ENABLE_DEBUG },
  ]

  // 运行时信息
  const runtimeInfo = {
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side',
    url: typeof window !== 'undefined' ? window.location.href : 'Server-side',
    isClient: typeof window !== 'undefined',
    timestamp: new Date().toISOString(),
    appMode: getAppMode(),
    appEnvironment: getAppEnvironment(),
    supabaseConfigured: isSupabaseConfigured(),
  }

  function maskSensitiveValue(value: string): string {
    if (value.length <= 8) return '***'
    return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
  }

  function copyToClipboard(text: string) {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text)
    }
  }

  // 只在开发环境或启用调试时显示
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ENABLE_DEBUG !== 'true') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="mb-2">
            <span className="mr-2">🔧 环境调试</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <Card className="w-96 max-h-96 overflow-y-auto">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">环境配置调试</CardTitle>
              <CardDescription className="text-xs">
                诊断本地与生产环境差异
              </CardDescription>
              
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSensitive(!showSensitive)}
                  className="h-6 px-2 text-xs"
                >
                  {showSensitive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  {showSensitive ? '隐藏' : '显示'}敏感信息
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4 text-xs">
              {/* 运行时信息 */}
              <div>
                <h4 className="font-medium mb-2">运行时信息</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>应用模式:</span>
                    <Badge variant={runtimeInfo.appMode === 'demo' ? 'secondary' : 'default'}>
                      {runtimeInfo.appMode}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>应用环境:</span>
                    <Badge variant={runtimeInfo.appEnvironment === 'development' ? 'secondary' : 'destructive'}>
                      {runtimeInfo.appEnvironment}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>渲染环境:</span>
                    <Badge variant={runtimeInfo.isClient ? 'default' : 'secondary'}>
                      {runtimeInfo.isClient ? 'Client' : 'Server'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Supabase:</span>
                    <Badge variant={runtimeInfo.supabaseConfigured ? 'default' : 'destructive'}>
                      {runtimeInfo.supabaseConfigured ? '已配置' : '未配置'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* 环境变量 */}
              <div>
                <h4 className="font-medium mb-2">环境变量</h4>
                <div className="space-y-1">
                  {envVars.map((env) => {
                    const hasValue = env.value !== undefined && env.value !== ''
                    const displayValue = env.isSensitive && !showSensitive && hasValue
                      ? maskSensitiveValue(env.value!)
                      : env.value || '未设置'
                    
                    return (
                      <div key={env.name} className="flex justify-between items-center gap-2">
                        <span className={`flex-1 ${env.isRequired ? 'font-medium' : ''}`}>
                          {env.name}:
                        </span>
                        <div className="flex items-center gap-1">
                          <span className={`text-xs ${hasValue ? 'text-green-600' : 'text-red-600'}`}>
                            {displayValue}
                          </span>
                          {hasValue && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(env.value!)}
                              className="h-4 w-4 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* URL信息 */}
              {runtimeInfo.isClient && (
                <div>
                  <h4 className="font-medium mb-2">URL信息</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>当前URL:</span>
                      <span className="text-xs text-blue-600 truncate max-w-32">
                        {new URL(runtimeInfo.url).hostname}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 pt-2 border-t">
                生成时间: {new Date(runtimeInfo.timestamp).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
} 