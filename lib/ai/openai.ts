import OpenAI from 'openai'

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY || 'placeholder-key'
  // Always create a new instance to ensure we use the latest API key
  return new OpenAI({ apiKey })
}

export async function callGPT4(prompt: string): Promise<{ content: string; responseTime: number }> {
  const startTime = Date.now()

  try {
    const openai = getOpenAI()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    })

    const responseTime = Date.now() - startTime
    const content = completion.choices[0]?.message?.content || 'No response'

    return { content, responseTime }
  } catch (error: any) {
    const responseTime = Date.now() - startTime
    throw new Error(`GPT-4 Error: ${error.message}`)
  }
}
