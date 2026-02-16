import { GoogleGenerativeAI } from '@google/generative-ai'

function getGoogleAI() {
  const apiKey = process.env.GOOGLE_AI_API_KEY || 'placeholder-key'
  // Always create a new instance to ensure we use the latest API key
  return new GoogleGenerativeAI(apiKey)
}

export async function callGemini(prompt: string): Promise<{ content: string; responseTime: number }> {
  const startTime = Date.now()

  try {
    const genAI = getGoogleAI()
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(prompt)
    const response = await result.response

    const responseTime = Date.now() - startTime
    const content = response.text() || 'No response'

    return { content, responseTime }
  } catch (error: any) {
    const responseTime = Date.now() - startTime
    throw new Error(`Gemini Error: ${error.message}`)
  }
}
