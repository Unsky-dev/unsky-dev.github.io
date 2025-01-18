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
  e.waitUntil(
    caches.open(APP_PREFIX + VERSION).then(function(cache) {
      return cache.addAll(URLS);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request).catch(() => caches.match(`${GHPATH}/offline.html`));
    })
  );
});