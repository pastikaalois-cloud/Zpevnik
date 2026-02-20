self.addEventListener('fetch', function(event) {});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request, { cache: 'no-cache' })
      .catch(() => caches.match(event.request))
  );
});
