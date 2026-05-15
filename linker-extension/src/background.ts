// Background Service Worker
// Receives LINK_CLICKED messages from the content script and saves them to the Linker API.

const API_URL = 'http://localhost:5000'

interface LinkClickedMessage {
  type: 'LINK_CLICKED'
  url: string
  title: string
}

// ── In-memory cache ────────────────────────────────────────────────────────────
// Avoids a chrome.storage read on every single click (saves ~50-150ms per save).
let cachedToken: string | null = null
let cachedIsTracking: boolean = false

// Warm the cache on SW startup
chrome.storage.local.get(['isTracking', 'token'], (result) => {
  cachedToken = (result['token'] as string | undefined) ?? null
  cachedIsTracking = (result['isTracking'] as boolean | undefined) ?? false
})

// Keep cache in sync whenever the popup changes storage
chrome.storage.onChanged.addListener((changes) => {
  if ('token' in changes) {
    cachedToken = (changes['token']?.newValue as string | undefined) ?? null
  }
  if ('isTracking' in changes) {
    cachedIsTracking = (changes['isTracking']?.newValue as boolean | undefined) ?? false
  }
})

// ── Message listener ───────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener(
  (
    message: LinkClickedMessage,
    _sender: chrome.runtime.MessageSender,
  ) => {
    if (message.type !== 'LINK_CLICKED') return false

    void handleLinkCapture(message.url, message.title).catch((err: unknown) => {
      console.warn('[Linker BG] handleLinkCapture failed:', err)
    })

    return false
  },
)

async function handleLinkCapture(url: string, title: string): Promise<void> {
  // Use in-memory cache — no storage I/O on the hot path
  if (!cachedIsTracking || !cachedToken) return

  const response = await fetch(`${API_URL}/api/links/extension`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cachedToken}`,
    },
    body: JSON.stringify({ url, title }),
  })

  if (!response.ok) {
    const body = (await response.json()) as { message?: string }
    console.warn('[Linker] Failed to save link:', body.message ?? response.statusText)
  }
}
}
