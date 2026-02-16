import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    anthropic_key_exists: !!process.env.ANTHROPIC_API_KEY,
    anthropic_key_length: process.env.ANTHROPIC_API_KEY?.length || 0,
    anthropic_key_starts: process.env.ANTHROPIC_API_KEY?.substring(0, 15) || 'NOT SET',
    openai_key_exists: !!process.env.OPENAI_API_KEY,
    google_key_exists: !!process.env.GOOGLE_AI_API_KEY,
  })
}
