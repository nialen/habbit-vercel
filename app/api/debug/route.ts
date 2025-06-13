import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const debug = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
      appMode: process.env.NEXT_PUBLIC_APP_MODE,
      nodeEnv: process.env.NODE_ENV,
    }

    const supabase = createServiceClient()
    const hasClient = !!supabase

    return NextResponse.json({ debug, hasClient })
  } catch (error) {
    console.error("调试API错误:", error)
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
} 