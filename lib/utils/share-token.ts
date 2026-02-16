import { nanoid } from 'nanoid'

export function generateShareToken(): string {
  return nanoid(32)
}

export function generateFingerprint(req: Request): string {
  const headers = req.headers
  const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown'
  const userAgent = headers.get('user-agent') || 'unknown'

  // Create a simple hash for fingerprinting
  const data = `${ip}-${userAgent}`
  return Buffer.from(data).toString('base64').slice(0, 100)
}
