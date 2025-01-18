var GHPATH = '/unsky-dev.github.io';
var APP_PREFIX = 'openlum';
var VERSION = 'version_05';

var URLS = [
  `${GHPATH}/index.html`,
  `${GHPATH}/assets/css/styles.css`,
  `${GHPATH}/offline.html`,
];

self.addEventListener('install', function (e) {
  console.log('[Service Worker] Install event triggered');
  e.waitUntil(
    caches.open(APP_PREFIX + VERSION).then(function (cache) {
      console.log('[Service Worker] Opened cache:', APP_PREFIX + VERSION);
      return cache.addAll(URLS).then(() => {
        console.log('[Service Worker] All files cached:', URLS);
      }).catch((err) => {
        console.error('[Service Worker] Caching failed:', err);
      });
    })
  );
});

self.addEventListener('activate', function (e) {
  console.log('[Service Worker] Activate event triggered');
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== APP_PREFIX + VERSION) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function (e) {
  console.log('[Service Worker] Fetch', e.request.url);

  e.respondWith(
    caches.match(e.request).then(function (response) {
      if (response) {
        console.log('[Service Worker] Found in cache:', e.request.url);
        return response; // Utilise la réponse mise en cache
      }

      console.log('[Service Worker] Network request for:', e.request.url);
      return fetch(e.request, { redirect: 'follow' }) // Suivre les redirections
        .then(function (networkResponse) {
          if (networkResponse.redirected) {
            console.log('[Service Worker] Handling redirected response');
            const clonedResponse = networkResponse.clone(); // Cloner la réponse pour éviter des effets secondaires
            return clonedResponse;
          }
          return networkResponse;
        })
        .catch(() => {
          console.log('[Service Worker] Fetch failed; returning offline page');
          if (e.request.mode === 'navigate') {
            return caches.match(`${GHPATH}/offline.html`); // Page hors ligne
          }
        });
    })
  );
});