import { NextResponse } from 'next/server'
import { callGPT4 } from '@/lib/ai/openai'
import { callClaude } from '@/lib/ai/anthropic'
import { callGemini } from '@/lib/ai/google'

export async function GET() {
  const results: any = {}

  // Test OpenAI
  try {
    const gpt4 = await callGPT4('Say hi')
    results.gpt4 = { success: true, content: gpt4.content }
  } catch (error: any) {
    results.gpt4 = {
      success: false,
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    }
  }

  // Test Anthropic
  try {
    const claude = await callClaude('Say hi')
    results.claude = { success: true, content: claude.content }
  } catch (error: any) {
    results.claude = {
      success: false,
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    }
  }

  // Test Google
  try {
    const gemini = await callGemini('Say hi')
    results.gemini = { success: true, content: gemini.content }
  } catch (error: any) {
    results.gemini = {
      success: false,
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    }
  }

  return NextResponse.json(results)
}
