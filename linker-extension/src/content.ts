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

    // sendMessage can throw if the service worker hasn't started yet.
    // Suppress the error — Chrome will have already woken the SW by the
    // time subsequent messages arrive.
    chrome.runtime.sendMessage({ type: 'LINK_CLICKED', url, title }).catch(() => {
      // SW was not ready; retry once after a short delay.
      setTimeout(() => {
        chrome.runtime.sendMessage({ type: 'LINK_CLICKED', url, title }).catch(() => {
          // Silently ignore second failure.
        })
      }, 500)
    })
  },
  true, // capture phase — catches all clicks before they bubble
)
