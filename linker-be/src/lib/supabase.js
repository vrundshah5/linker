import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  Supabase env vars missing — live notifications disabled')
}

export const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

/**
 * Broadcast a notification event to a specific user's Realtime channel.
 * Uses the Supabase REST broadcast API (no WebSocket required on the server).
 */
export async function broadcastNotification(userId, payload) {
  if (!supabase) return
  try {
    await fetch(`${supabaseUrl}/realtime/v1/api/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        messages: [
          {
            topic: `realtime:notifications:${userId}`,
            event: 'new_notification',
            payload,
          },
        ],
      }),
    })
  } catch (err) {
    console.error('Supabase broadcast error:', err.message)
  }
}
