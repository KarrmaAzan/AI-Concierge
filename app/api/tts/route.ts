import OpenAI from 'openai'
import { checkRateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('Missing OPENAI_API_KEY')
}

const openai = new OpenAI({ apiKey })

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  return 'unknown'
}

function getSessionId(req: Request) {
  return req.headers.get('x-amhrl-session-id')?.trim() || 'no-session'
}

export async function GET() {
  return Response.json({ ok: true, route: 'tts works' })
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const sessionId = getSessionId(req)
    const limitKey = `${ip}:${sessionId}`

    const rate = await checkRateLimit({
      key: limitKey,
      route: 'tts',
      limit: 12,
      windowSeconds: 300,
    })

    if (!rate.allowed) {
      return Response.json(
        {
          error: 'Voice rate limit exceeded. Please wait before trying again.',
          retryAfter: rate.retry_after,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rate.retry_after),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }

    const body = await req.json()
    const text = body?.text

    if (!text || typeof text !== 'string') {
      return Response.json({ error: 'Missing text' }, { status: 400 })
    }

    const speech = await openai.audio.speech.create({
      model: 'gpt-4o-mini-tts',
      voice: 'alloy',
      input: text,
      response_format: 'mp3',
    })

    const arrayBuffer = await speech.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(buffer.length),
        'Cache-Control': 'no-store',
        'X-RateLimit-Remaining': String(rate.remaining),
      },
    })
  } catch (error: any) {
    console.error('TTS route error:', error)

    const status =
      typeof error?.status === 'number'
        ? error.status
        : typeof error?.code === 'number'
        ? error.code
        : 500

    const message = error?.message || 'Failed to generate speech'

    return Response.json({ error: message }, { status })
  }
}