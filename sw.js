const CACHE_NAME = 'daily-routine-v1';
const ASSETS = [
    '/daily-routine-tracker/daily-routine-tracker.html',
    '/daily-routine-tracker/manifest.json',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap'
  ];

// Install - cache core assets
self.addEventListener('install', e => {
    e.waitUntil(
          caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
        );
    self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', e => {
    e.waitUntil(
          caches.keys().then(keys =>
                  Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
                                 )
        );
    self.clients.claim();
});

// Fetch - network first, fall back to cache
self.addEventListener('fetch', e => {
    e.respondWith(
          fetch(e.request)
            .then(res => {
                      const clone = res.clone();
                      caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
                      return res;
            })
            .catch(() => caches.match(e.request))
        );
});
