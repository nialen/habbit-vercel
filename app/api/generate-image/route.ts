import { type NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

// 初始化Replicate客户端
function createReplicateClient() {
  const apiToken = process.env.HABIT_IMAGE_TOKEN
  if (!apiToken) {
    throw new Error("HABIT_IMAGE_TOKEN environment variable is not set")
  }

  return new Replicate({
    auth: apiToken,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, aspectRatio = "3:2" } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "请提供图片描述" }, { status: 400 })
    }

    if (prompt.length > 500) {
      return NextResponse.json({ error: "描述内容不能超过500字" }, { status: 400 })
    }

    const replicate = createReplicateClient()

    // 构建适合儿童的图片提示词
    const childFriendlyPrompt = `Vector art style, colorful and cheerful, child-friendly, safe for kids: ${prompt}. The image should be educational, positive, and appealing to children aged 3-10. Use bright colors and friendly characters.`

    const input = {
      prompt: childFriendlyPrompt,
      aspect_ratio: aspectRatio,
      quality: "standard",
      style: "vector", // 向量风格更适合儿童
    }

    console.log("Generating image with prompt:", childFriendlyPrompt)

    const output = await replicate.run("ideogram-ai/ideogram-v2a", { 
      input 
    }) as unknown

    if (!output || typeof output !== 'string') {
      throw new Error("No valid image URL generated")
    }

    return NextResponse.json({
      success: true,
      imageUrl: output as string,
      prompt: childFriendlyPrompt
    })

  } catch (error) {
    console.error("图片生成API错误:", error)
    
    return NextResponse.json({ 
      error: "图片生成服务暂时不可用，请稍后再试",
      success: false
    }, { status: 500 })
  }
}
