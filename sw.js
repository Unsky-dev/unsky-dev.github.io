var GHPATH = '/unsky-dev.github.io';
var APP_PREFIX = 'openlum';
var VERSION = 'version_02';

var URLS = [    
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/assets/css/styles.css`,
  `${GHPATH}/offline.html`
];

self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(APP_PREFIX + VERSION).then(function(cache) {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(URLS);
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        console.log('[Service Worker] Found in cache', e.request.url);
        return response; // Utilisez la réponse en cache directement.
      }
      console.log('[Service Worker] Network request for', e.request.url);
      return fetch(e.request).then(function(networkResponse) {
        if (networkResponse.redirected) {
          // Cloner et nettoyer les réponses redirigées.
          console.log('[Service Worker] Redirected response from network', e.request.url);
          const cleanResponse = networkResponse.clone();
          return cleanResponse;
        }
        return networkResponse;
      }).catch(() => {
        console.log('[Service Worker] Fetch failed; returning offline page');
        if (e.request.mode === 'navigate') {
          return caches.match(`./offline.html`);
        }
      });
    })
  );
});