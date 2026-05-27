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
 * Broadcast an event to a Supabase Realtime channel.
 * @param {string} channel - Channel name (e.g. 'notifications:userId', 'buzz-mention:userId')
 * @param {string} event   - Realtime event name (e.g. 'new_notification', 'new_buzz')
 * @param {object} payload - Arbitrary payload sent with the event
 */
export async function broadcastNotification(channel, event, payload = {}) {
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
            topic: `realtime:${channel}`,
            event,
            payload,
          },
        ],
      }),
    })
  } catch (err) {
    console.error('Supabase broadcast error:', err.message)
  }
}
