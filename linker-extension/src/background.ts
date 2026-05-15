// Background Service Worker
// Receives LINK_CLICKED messages from the content script and saves them to the Linker API.

const API_URL = 'http://localhost:5000'

interface LinkClickedMessage {
  type: 'LINK_CLICKED'
  url: string
  title: string
}

chrome.runtime.onMessage.addListener(
  (
    message: LinkClickedMessage,
    _sender: chrome.runtime.MessageSender,
  ) => {
    if (message.type !== 'LINK_CLICKED') return false

    // Fire-and-forget: Chrome keeps the service worker alive while
    // chrome.storage.local.get() is in-flight, which covers the fetch too.
    void handleLinkCapture(message.url, message.title).catch((err: unknown) => {
      console.warn('[Linker BG] handleLinkCapture failed:', err)
    })

    // Return false — no async sendResponse needed.
    return false
  },
)

async function handleLinkCapture(url: string, title: string): Promise<void> {
  const result = await chrome.storage.local.get(['isTracking', 'token'])

  const isTracking = result['isTracking'] as boolean | undefined
  const token = result['token'] as string | undefined

  if (!isTracking || !token) return

  const response = await fetch(`${API_URL}/api/links/extension`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url, title }),
  })

  if (!response.ok) {
    const body = (await response.json()) as { message?: string }
    console.warn('[Linker] Failed to save link:', body.message ?? response.statusText)
  }
}
