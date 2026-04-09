type EventPayload = {
  type: string
  leadId?: string | null
  metadata?: Record<string, unknown>
}

const SESSION_KEY = 'amhrl_session_id'
const THROTTLE_KEY = 'amhrl_event_throttle'

export function getSessionId() {
  if (typeof window === 'undefined') return 'server'

  const existing = window.sessionStorage.getItem(SESSION_KEY)
  if (existing) return existing

  const sessionId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

  window.sessionStorage.setItem(SESSION_KEY, sessionId)
  return sessionId
}

function shouldThrottle(type: string, metadata?: Record<string, unknown>) {
  if (typeof window === 'undefined') return false

  const raw = window.sessionStorage.getItem(THROTTLE_KEY)
  const cache: Record<string, number> = raw ? JSON.parse(raw) : {}

  const key = `${type}:${JSON.stringify(metadata ?? {})}`
  const now = Date.now()
  const previous = cache[key] ?? 0

  if (now - previous < 1200) {
    return true
  }

  cache[key] = now
  window.sessionStorage.setItem(THROTTLE_KEY, JSON.stringify(cache))
  return false
}

export async function logEvent(payload: EventPayload) {
  try {
    if (shouldThrottle(payload.type, payload.metadata)) return

    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        sessionId: getSessionId(),
      }),
    })
  } catch {
    // never break UX because of analytics
  }
}