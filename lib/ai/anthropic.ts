import Anthropic from '@anthropic-ai/sdk'

function getAnthropic() {
  // Try multiple env var names as fallback
  const apiKey = process.env.TEST_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY || 'placeholder-key'
  // Always create a new instance to ensure we use the latest API key
  return new Anthropic({ apiKey })
}

export async function callClaude(prompt: string): Promise<{ content: string; responseTime: number }> {
  const startTime = Date.now()

  try {
    const anthropic = getAnthropic()
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const responseTime = Date.now() - startTime
    const content = message.content[0]?.type === 'text' ? message.content[0].text : 'No response'

    return { content, responseTime }
  } catch (error: any) {
    const responseTime = Date.now() - startTime
    throw new Error(`Claude Error: ${error.message}`)
  }
}
