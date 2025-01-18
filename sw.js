var GHPATH = '/unsky-dev.github.io';
var APP_PREFIX = 'openlum';
var VERSION = 'version_00';

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
        if (response.redirected) {
          console.log('[Service Worker] Redirected response found in cache', e.request.url);
          return fetch(e.request);
        }
        return response;
      }
      console.log('[Service Worker] Network request for', e.request.url);
      return fetch(e.request).then(function(networkResponse) {
        if (networkResponse.redirected) {
          console.log('[Service Worker] Redirected response from network', e.request.url);
          return fetch(e.request);
        }
        return networkResponse;
      }).catch(() => {
        console.log('[Service Worker] Fetch failed; returning offline page');
        if (e.request.mode === 'navigate') {
          return caches.match(`${GHPATH}/offline.html`);
        }
      });
    })
  );
});