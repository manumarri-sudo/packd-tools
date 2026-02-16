import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { callGPT4 } from '@/lib/ai/openai'
import { callClaude } from '@/lib/ai/anthropic'
import { callGemini } from '@/lib/ai/google'
import { supabaseAdmin } from '@/lib/supabase/server'
import { generateShareToken } from '@/lib/utils/share-token'
import type { ComparisonResults } from '@/lib/types/modelduel'

const CompareSchema = z.object({
  mode: z.enum(['single', 'multi']),
  prompt: z.string().min(1).max(5000),
  examples: z
    .array(
      z.object({
        input: z.string(),
        variables: z.record(z.string()).optional(),
      })
    )
    .max(10)
    .optional(),
})

export async function POST(req: NextRequest) {
  try {
    // Parse and validate input
    const body = await req.json()
    const validation = CompareSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: validation.error.errors,
        },
        { status: 400 }
      )
    }

    const { mode, prompt, examples } = validation.data

    // Call all three AI models in parallel with timeout
    const timeout = 30000 // 30 seconds
    const callWithTimeout = async <T,>(promise: Promise<T>): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout after 30s')), timeout)
        ),
      ])
    }

    const [gpt4Result, claudeResult, geminiResult] = await Promise.allSettled([
      callWithTimeout(callGPT4(prompt)),
      callWithTimeout(callClaude(prompt)),
      callWithTimeout(callGemini(prompt)),
    ])

    const results: ComparisonResults = {
      gpt4:
        gpt4Result.status === 'fulfilled'
          ? gpt4Result.value
          : { content: '', responseTime: 0, error: gpt4Result.reason.message },
      claude:
        claudeResult.status === 'fulfilled'
          ? claudeResult.value
          : { content: '', responseTime: 0, error: claudeResult.reason.message },
      gemini:
        geminiResult.status === 'fulfilled'
          ? geminiResult.value
          : { content: '', responseTime: 0, error: geminiResult.reason.message },
    }

    // Generate share token
    const shareToken = generateShareToken()

    // Save to database (temporarily skip auth for testing)
    const { data: comparison, error: dbError } = await supabaseAdmin
      .from('modelduel_comparisons')
      .insert({
        user_id: null, // Allow anonymous for now
        mode,
        prompt,
        examples: examples || null,
        results,
        share_token: shareToken,
        is_public: true,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save comparison',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        comparisonId: comparison.id,
        shareToken,
        results,
        responseTime: {
          gpt4: results.gpt4.responseTime,
          claude: results.claude.responseTime,
          gemini: results.gemini.responseTime,
        },
      },
    })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}
