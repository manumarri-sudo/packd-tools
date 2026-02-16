import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    all_env_keys: Object.keys(process.env).filter(k => k.includes('ANTHROPIC') || k.includes('TEST')),
    test_key: process.env.TEST_ANTHROPIC_KEY?.substring(0, 20),
    anthropic_key: process.env.ANTHROPIC_API_KEY?.substring(0, 20),
  })
}
