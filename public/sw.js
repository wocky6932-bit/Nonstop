const CACHE_NAME = 'nonstop-shell-v3'
const STATIC_CACHE = ['/manifest.webmanifest']

// Immediate takeover to ensure obsolete caches are cleared
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  )
})

// Always fetch fresh network requests, avoid serving stale broken scripts
self.addEventListener('fetch', (event) => {
  // Let browser handle normal fetching without aggressive interception
  return
})
