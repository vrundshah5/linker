// Background Service Worker
// Captures every page the user visits via chrome.tabs.onUpdated and saves to the Linker API.

const API_URL = 'http://localhost:5000'

// ── In-memory cache ─────────────────────────────────────────────────────────
let cachedToken: string | null = null
let cachedIsTracking: boolean = false
let cacheReady = false

const cacheReadyPromise = new Promise<void>((resolve) => {
  chrome.storage.local.get(['isTracking', 'token'], (result) => {
    cachedToken = (result['token'] as string | undefined) ?? null
    cachedIsTracking = (result['isTracking'] as boolean | undefined) ?? false
    cacheReady = true
    resolve()
  })
})

chrome.storage.onChanged.addListener((changes) => {
  if ('token' in changes) {
    cachedToken = (changes['token']?.newValue as string | undefined) ?? null
  }
  if ('isTracking' in changes) {
    cachedIsTracking = (changes['isTracking']?.newValue as boolean | undefined) ?? false
  }
})

// ── Deduplicate rapid duplicate saves ────────────────────────────────────────
// Tabs often fire onUpdated multiple times for the same URL (redirects, SPA
// re-renders). Keep a small set of recently-saved URLs and skip duplicates
// within a 5-second window.
const recentlySaved = new Map<string, number>()

function wasRecentlySaved(url: string): boolean {
  const savedAt = recentlySaved.get(url)
  if (savedAt && Date.now() - savedAt < 5_000) return true
  recentlySaved.set(url, Date.now())
  // Trim old entries to avoid unbounded growth
  if (recentlySaved.size > 200) {
    const cutoff = Date.now() - 5_000
    for (const [key, ts] of recentlySaved) {
      if (ts < cutoff) recentlySaved.delete(key)
    }
  }
  return false
}

// ── Tab update listener ──────────────────────────────────────────────────────
// Fires whenever any tab finishes loading — catches address bar navigation,
// bookmark clicks, link clicks, redirects, JS navigation — everything.
chrome.tabs.onUpdated.addListener(
  (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
    // Only act on fully-loaded pages
    if (changeInfo.status !== 'complete') return

    const url = tab.url
    if (!url) return

    // Skip non-http pages (new tab, extensions, settings, etc.)
    if (!url.startsWith('http://') && !url.startsWith('https://')) return

    // Skip localhost / local network URLs
    if (
      url.startsWith('http://localhost') ||
      url.startsWith('https://localhost') ||
      url.startsWith('http://127.0.0.1') ||
      url.startsWith('https://127.0.0.1') ||
      url.startsWith('http://0.0.0.0') ||
      url.startsWith('https://0.0.0.0')
    ) return

    // Skip our own API URL
    if (url.startsWith(API_URL)) return

    const title = (tab.title || url).slice(0, 200)

    void saveLink(url, title, tabId).catch((err: unknown) => {
      console.warn('[Linker BG] saveLink failed:', err)
    })
  },
)

async function saveLink(url: string, title: string, _tabId: number): Promise<void> {
  if (!cacheReady) await cacheReadyPromise
  if (!cachedIsTracking || !cachedToken) return
  if (wasRecentlySaved(url)) return

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
