import Anthropic from '@anthropic-ai/sdk'

let anthropicInstance: Anthropic | null = null

function getAnthropic() {
  if (!anthropicInstance) {
    anthropicInstance = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || 'placeholder-key',
    })
  }
  return anthropicInstance
}

export async function callClaude(prompt: string): Promise<{ content: string; responseTime: number }> {
  const startTime = Date.now()

  try {
    const anthropic = getAnthropic()
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
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
