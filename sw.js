const CACHE_NAME = 'vibetag-cache-v1';
const urlsToCache = [
  './index.html',
  './style.css',
  './app.js',
  './manifest.json'
];

// Install Service Worker and cache all files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached files dynamically for offline support
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
