// Content Script
// Intercepts <a> link clicks and notifies the background service worker.

document.addEventListener(
  'click',
  (event: MouseEvent) => {
    const target = event.target as HTMLElement
    const anchor = target.closest('a') as HTMLAnchorElement | null

    if (!anchor) return

    const url = anchor.href
    if (
      !url ||
      url.startsWith('javascript:') ||
      url.startsWith('#') ||
      url === window.location.href ||
      // Skip chrome internal and extension pages
      url.startsWith('chrome://') ||
      url.startsWith('chrome-extension://') ||
      url.startsWith('about:')
    ) {
      return
    }

    const title = (
      anchor.textContent?.trim() ||
      anchor.title ||
      anchor.getAttribute('aria-label') ||
      document.title ||
      url
    ).slice(0, 200)

    // Fire-and-forget. If the SW cold-starts, Chrome automatically wakes it
    // and the message is queued — no retry delay needed.
    chrome.runtime.sendMessage({ type: 'LINK_CLICKED', url, title }).catch(() => {
      // Retry immediately (no delay) — SW should be awake by now.
      chrome.runtime.sendMessage({ type: 'LINK_CLICKED', url, title }).catch(() => {
        // Silently ignore second failure.
      })
    })
  },
  true, // capture phase — catches all clicks before they bubble
)
