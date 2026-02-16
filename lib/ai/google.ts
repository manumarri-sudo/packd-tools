import { GoogleGenerativeAI } from '@google/generative-ai'

let genAIInstance: GoogleGenerativeAI | null = null

function getGoogleAI() {
  if (!genAIInstance) {
    genAIInstance = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || 'placeholder-key')
  }
  return genAIInstance
}

export async function callGemini(prompt: string): Promise<{ content: string; responseTime: number }> {
  const startTime = Date.now()

  try {
    const genAI = getGoogleAI()
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
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
