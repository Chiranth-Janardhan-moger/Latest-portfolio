const CACHE_NAME = 'moger-systems-pwa-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/og-image.png',
  '/assets/logo.svg',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml'
];

self.addEventListener('install', (event) => {
  console.log('%c[Service Worker] Booting offline sandbox state...', 'color: #38bdf8; font-weight: bold; font-family: monospace;');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('%c[Service Worker] Pre-caching application shells & assets...', 'color: #34d399; font-family: monospace;');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('%c[Service Worker] Systems security & caching subsystem initialized.', 'color: #a855f7; font-weight: bold; font-family: monospace;');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log(`%c[Service Worker] Purging stale storage unit: ${cache}`, 'color: #f87171; font-family: monospace;');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only intercept standard GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Handle dynamic /api calls: Network-First with safe Offline JSON fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          console.warn(`%c[Service Worker] Network disruption detected on ${url.pathname}. Loading offline mock/cache...`, 'color: #fbbf24; font-family: monospace;');
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            if (url.pathname === '/api/visits') {
              return new Response(JSON.stringify({ count: 999, offline: true }), {
                headers: { 'Content-Type': 'application/json' }
              });
            }
            return new Response(JSON.stringify({ offline: true, error: "Network connection unavailable." }), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // Static Assets / HTML Pages: Cache-First with Stale-While-Revalidate background updates
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch updated asset from network in the background to update cache for next load
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {
            // Silence background fetch failures when completely offline
          });
        return cachedResponse;
      }

      // If missing from cache, fetch normally and save to storage
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // If completely disconnected and user navigates, serve index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
    })
  );
});
