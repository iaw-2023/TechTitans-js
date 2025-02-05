const CACHE_NAME = "reserva-canchas-cache-v1"
const urlsToCache = [
  "/",
  "/index.html",
  "/static/js/main.chunk.js",
  "/static/js/0.chunk.js",
  "/static/js/bundle.js",
  "/static/css/main.chunk.css",
  "/manifest.json",
  "/components/imagenes/logo.png",
]

// Instalación del Service Worker y almacenamiento en caché inicial
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Archivos almacenados en caché durante la instalación.');
        return cache.addAll(urlsToCache);
      })
    );
  });
  
  // Activación del Service Worker y limpieza de cachés antiguas
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log(`Eliminando caché antigua: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
  
  // Interceptación de solicitudes para usar el caché primero
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Devuelve la respuesta del caché si existe, de lo contrario, realiza la solicitud de red
        return response || fetch(event.request);
      })
    );
  });