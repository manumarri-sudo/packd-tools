import { NextResponse } from 'next/server'

export async function GET() {
  const results: any = {}

  // Test direct fetch to OpenAI
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 10
      })
    })

    const data = await response.json()
    results.openai = {
      success: response.ok,
      status: response.status,
      data: response.ok ? data.choices[0].message.content : data
    }
  } catch (error: any) {
    results.openai = { success: false, error: error.message }
  }

  // Test direct fetch to Anthropic
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.TEST_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }]
      })
    })

    const data = await response.json()
    results.anthropic = {
      success: response.ok,
      status: response.status,
      data: response.ok ? data.content[0].text : data
    }
  } catch (error: any) {
    results.anthropic = { success: false, error: error.message }
  }

  return NextResponse.json(results)
}
