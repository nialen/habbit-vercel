import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"
import type { Database } from "@/types/database"
import { randomUUID } from "crypto"

type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "用户ID不能为空" }, { status: 400 })
    }

    const supabase = createServiceClient()
    if (!supabase) {
      return NextResponse.json({ error: "数据库连接失败" }, { status: 500 })
    }

    console.log('🔍 查询用户资料:', userId)

    const { data: userProfile, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("获取用户资料失败:", error)
      return NextResponse.json({ error: "用户资料不存在" }, { status: 404 })
    }

    console.log('✅ 用户资料获取成功:', userProfile)
    return NextResponse.json({ userProfile })
  } catch (error) {
    console.error("获取用户资料失败:", error)
    return NextResponse.json({ error: "获取用户资料失败" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    let { userId, ...updateData } = body

    console.log('🔄 PUT请求数据:', { userId, updateData })

    // 如果没有提供userId或者userId不是有效的UUID格式，生成一个新的
    if (!userId || !isValidUUID(userId)) {
      userId = randomUUID()
      console.log('🆔 生成新的UUID:', userId)
    }

    const supabase = createServiceClient()
    if (!supabase) {
      console.error('❌ Supabase客户端创建失败')
      return NextResponse.json({ error: "数据库连接失败" }, { status: 500 })
    }

    console.log('✅ Supabase客户端创建成功')

    // 先检查用户资料是否存在
    console.log('🔍 查询现有用户资料...')
    const { data: existingProfile, error: fetchError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single()
    
    console.log('查询结果:', { existingProfile, fetchError })

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("查询用户资料失败:", fetchError)
      // 如果是UUID相关错误，尝试创建新的
      if (fetchError.message?.includes('uuid') || fetchError.message?.includes('UUID')) {
        userId = randomUUID()
        console.log('🆔 UUID错误，生成新UUID:', userId)
      } else {
        return NextResponse.json({ error: "查询用户资料失败" }, { status: 500 })
      }
    }

    if (!existingProfile) {
      // 如果用户资料不存在，创建新的
      console.log('📝 创建新用户资料...')
      const insertData = {
        id: userId,
        email: updateData.email || "",
        name: updateData.name || "用户",
        child_name: updateData.child_name || "",
        child_age: updateData.child_age || 5,
      }
      console.log('插入数据:', insertData)

      // 直接使用SQL来插入，绕过RLS
      const { data: newProfile, error: insertError } = await supabase
        .rpc('create_user_profile', {
          profile_id: userId,
          profile_email: updateData.email || "",
          profile_name: updateData.name || "用户",
          profile_child_name: updateData.child_name || "",
          profile_child_age: updateData.child_age || 5,
        })
      
      console.log('插入结果:', { newProfile, insertError })

      if (insertError) {
        console.error("创建用户资料失败:", insertError)
        // 如果函数不存在，回退到普通插入
        const { data: fallbackProfile, error: fallbackError } = await supabase
          .from("user_profiles")
          .insert(insertData)
          .select()
          .single()
        
        if (fallbackError) {
          console.error("回退插入也失败:", fallbackError)
          return NextResponse.json({ 
            error: "创建用户资料失败: " + fallbackError.message + " (可能需要数据库管理员手动处理外键约束)",
            suggestion: "请切换到演示模式或联系管理员配置数据库"
          }, { status: 500 })
        }
        
        console.log('✅ 回退插入成功:', fallbackProfile)
        return NextResponse.json({ userProfile: fallbackProfile }, { status: 201 })
      }
      
      console.log('✅ 用户资料创建成功:', newProfile)
      return NextResponse.json({ userProfile: { id: userId, email: updateData.email || "", name: updateData.name || "用户", child_name: updateData.child_name || "", child_age: updateData.child_age || 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } }, { status: 201 })
    }

    // 更新现有用户资料
    console.log('📝 更新现有用户资料...')
    const { data: updatedProfile, error: updateError } = await supabase
      .from("user_profiles")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    console.log('更新结果:', { updatedProfile, updateError })

    if (updateError) {
      console.error("更新用户资料失败:", updateError)
      return NextResponse.json({ error: "更新用户资料失败: " + updateError.message }, { status: 500 })
    }

    console.log('✅ 用户资料更新成功:', updatedProfile)
    return NextResponse.json({ userProfile: updatedProfile })
  } catch (error) {
    console.error("更新用户资料失败:", error)
    return NextResponse.json({ error: "更新用户资料失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    let { userId, email, name, child_name, child_age } = body

    // 如果没有userId，生成一个
    if (!userId) {
      userId = randomUUID()
    }

    if (!email) {
      return NextResponse.json({ error: "邮箱不能为空" }, { status: 400 })
    }

    const supabase = createServiceClient()
    if (!supabase) {
      return NextResponse.json({ error: "数据库连接失败" }, { status: 500 })
    }

    const { data: userProfile, error } = await supabase
      .from("user_profiles")
      .insert({
        id: userId,
        email,
        name: name || "用户", 
        child_name: child_name || "",
        child_age: child_age || 5,
      })
      .select()
      .single()

    if (error) {
      console.error("创建用户资料失败:", error)
      return NextResponse.json({ error: "创建用户资料失败: " + error.message }, { status: 500 })
    }

    return NextResponse.json({ userProfile }, { status: 201 })
  } catch (error) {
    console.error("创建用户资料失败:", error)
    return NextResponse.json({ error: "创建用户资料失败" }, { status: 500 })
  }
}

// 辅助函数：验证UUID格式
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
} 