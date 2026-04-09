import { supabaseAdmin } from '@/lib/supabase'

type EventBody = {
  type?: string
  sessionId?: string | null
  leadId?: string | null
  metadata?: Record<string, unknown>
}

const allowedTypes = new Set([
  'service_selected',
  'section_viewed',
  'see_more_clicked',
  'book_clicked',
])

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as EventBody

    if (!body.type || !allowedTypes.has(body.type)) {
      return Response.json({ error: 'Invalid event type' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from('events').insert({
      type: body.type,
      session_id: body.sessionId ?? null,
      lead_id: body.leadId ?? null,
      metadata: body.metadata ?? {},
    })

    if (error) {
      console.error('Supabase events insert error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Events route error:', error)
    return Response.json({ error: 'Failed to store event' }, { status: 500 })
  }
}