// Service Worker - verze se musí změnit při každém nasazení!
const CACHE_VERSION = 'zpevnik-v3';
const CACHE_ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(CACHE_ASSETS))
  );
  // Okamžitě aktivuj nový SW bez čekání
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    // Smaž všechny staré cache
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    )
  );
  // Převezmi kontrolu nad všemi stránkami okamžitě
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    // Network first — vždy zkus načíst čerstvý obsah
    fetch(e.request)
      .then(res => {
        // Ulož čerstvou verzi do cache
        const clone = res.clone();
        caches.open(CACHE_VERSION).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => {
        // Offline fallback — vrať z cache
        return caches.match(e.request);
      })
  );
});
