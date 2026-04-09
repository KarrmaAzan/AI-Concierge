import { supabaseAdmin } from '@/lib/supabase'

type RateLimitResult = {
  allowed: boolean
  remaining: number
  retry_after: number
}

export async function checkRateLimit(params: {
  key: string
  route: string
  limit: number
  windowSeconds: number
}): Promise<RateLimitResult> {
  const { data, error } = await supabaseAdmin.rpc('check_rate_limit', {
    p_key: params.key,
    p_route: params.route,
    p_limit: params.limit,
    p_window_seconds: params.windowSeconds,
  })

  if (error) {
    throw new Error(`Rate limit check failed: ${error.message}`)
  }

  return data as RateLimitResult
}