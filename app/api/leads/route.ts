import { supabaseAdmin } from '@/lib/supabase'

type LeadBody = {
  name?: string
  email?: string
  company?: string
  service?: string
  notes?: string
  sessionId?: string | null
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LeadBody

    if (!body.email?.trim()) {
      return Response.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!isValidEmail(body.email.trim())) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const insertPayload = {
      name: body.name?.trim() || null,
      email: body.email.trim().toLowerCase(),
      company: body.company?.trim() || null,
      service: body.service?.trim() || null,
      notes: body.notes?.trim() || null,
      session_id: body.sessionId ?? null,
      source: 'amhrl',
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert(insertPayload)
      .select('id')
      .single()

    if (error) {
      console.error('Supabase leads insert error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({
      success: true,
      lead: data,
    })
  } catch (error) {
    console.error('Leads route error:', error)
    return Response.json({ error: 'Failed to store lead' }, { status: 500 })
  }
}