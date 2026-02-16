export async function callClaude(prompt: string): Promise<{ content: string; responseTime: number }> {
  const startTime = Date.now()

  try {
    const apiKey = process.env.TEST_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY || 'placeholder-key'

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`${response.status} ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const responseTime = Date.now() - startTime
    const content = data.content[0]?.text || 'No response'

    return { content, responseTime }
  } catch (error: any) {
    const responseTime = Date.now() - startTime
    throw new Error(`Claude Error: ${error.message}`)
  }
}
