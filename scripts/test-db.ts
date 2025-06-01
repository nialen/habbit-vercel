import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

async function testDatabase() {
  try {
    // 获取所有帖子
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*, comments(*)')
      .order('inserted_at')

    if (postsError) throw postsError

    console.log('获取到的帖子和评论：')
    console.log(JSON.stringify(posts, null, 2))

  } catch (error) {
    console.error('测试过程中发生错误：', error)
  }
}

testDatabase()
