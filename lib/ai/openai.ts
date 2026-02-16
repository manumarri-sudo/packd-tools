export async function callGPT4(prompt: string): Promise<{ content: string; responseTime: number }> {
  const startTime = Date.now()

  try {
    const apiKey = process.env.OPENAI_API_KEY || 'placeholder-key'

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`${response.status} ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const responseTime = Date.now() - startTime
    const content = data.choices[0]?.message?.content || 'No response'

    return { content, responseTime }
  } catch (error: any) {
    const responseTime = Date.now() - startTime
    throw new Error(`GPT-4 Error: ${error.message}`)
  }
}
