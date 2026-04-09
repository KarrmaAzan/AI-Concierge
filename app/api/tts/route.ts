import OpenAI from 'openai'

export const runtime = 'nodejs'

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('Missing OPENAI_API_KEY')
}

const openai = new OpenAI({ apiKey })

const requestMap = new Map<string, number[]>()

function isRateLimited(key: string, limit = 8, windowMs = 60_000) {
  const now = Date.now()
  const timestamps = requestMap.get(key) ?? []
  const recent = timestamps.filter((time) => now - time < windowMs)

  if (recent.length >= limit) {
    requestMap.set(key, recent)
    return true
  }

  recent.push(now)
  requestMap.set(key, recent)
  return false
}

export async function GET() {
  return Response.json({ ok: true, route: 'tts works' })
}

export async function POST(req: Request) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for') ?? 'unknown'
    const rateKey = forwardedFor.split(',')[0].trim()

    if (isRateLimited(rateKey)) {
      return Response.json(
        { error: 'Rate limit exceeded for voice requests.' },
        { status: 429 }
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