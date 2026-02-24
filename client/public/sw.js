// Service Worker para IPA Xerez PWA
const CACHE_VERSION = 'v1';
const CACHE_NAME = `ipa-xerez-${CACHE_VERSION}`;
const RUNTIME_CACHE = `ipa-xerez-runtime-${CACHE_VERSION}`;
const IMAGES_CACHE = `ipa-xerez-images-${CACHE_VERSION}`;

// Archivos críticos para cachear en la instalación
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/favicon-192.png',
  '/favicon-512.png',
  '/manifest.json'
];

// Patrones de URLs que se deben cachear
const CACHE_PATTERNS = {
  // Network first - intentar red primero, fallback a caché
  networkFirst: [
    /^\/api\//,
    /^https:\/\/www\.googletagmanager\.com/,
    /^https:\/\/www\.google-analytics\.com/
  ],
  // Cache first - usar caché primero, fallback a red
  cacheFirst: [
    /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
    /\.(?:woff|woff2|ttf|eot)$/i,
    /^https:\/\/fonts\.googleapis\.com/,
    /^https:\/\/fonts\.gstatic\.com/
  ],
  // Stale while revalidate - usar caché pero actualizar en background
  staleWhileRevalidate: [
    /\.(?:js|css)$/i,
    /^\/blog/,
    /^\/gallery/
  ]
};

// Instalar service worker y cachear archivos críticos
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching critical assets');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => {
        console.log('[SW] Service worker installed');
        self.skipWaiting();
      })
      .catch(err => {
        console.error('[SW] Installation failed:', err);
      })
  );
});

// Activar service worker y limpiar cachés viejos
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheName.startsWith('ipa-xerez-')) {
              return caches.delete(cacheName);
            }
            // Limpiar versiones antiguas
            if (cacheName !== CACHE_NAME && 
                cacheName !== RUNTIME_CACHE && 
                cacheName !== IMAGES_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Interceptar requests y aplicar estrategias de caché
self.addEventListener('fetch', event => {
  const { request } = event;

  // Some requests can have non-standard / invalid URLs (extensions, etc.)
  let url;
  try {
    url = new URL(request.url);
  } catch (e) {
    return; // ignore and let the browser handle it
  }
if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  // Determinar estrategia según el patrón de URL
  if (matchesPattern(url, CACHE_PATTERNS.networkFirst)) {
    event.respondWith(networkFirst(request));
  } else if (matchesPattern(url, CACHE_PATTERNS.cacheFirst)) {
    event.respondWith(cacheFirst(request));
  } else if (matchesPattern(url, CACHE_PATTERNS.staleWhileRevalidate)) {
    event.respondWith(staleWhileRevalidate(request));
  } else {
    // Por defecto: network first
    event.respondWith(networkFirst(request));
  }
});

// Estrategia: Network First
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      console.log('[SW] Using cached response for:', request.url);
      return cached;
    }
    return createOfflineResponse();
  }
}

// Estrategia: Cache First
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(IMAGES_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Fetch failed for:', request.url, error);
    return createOfflineResponse();
  }
}

// Estrategia: Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        const cache = caches.open(RUNTIME_CACHE);
        cache.then(c => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(error => {
      console.error('[SW] Fetch failed for:', request.url, error);
      return cached || createOfflineResponse();
    });

  return cached || fetchPromise;
}

// Verificar si una URL coincide con algún patrón
function matchesPattern(url, patterns) {
  return patterns.some(pattern => pattern.test(url.href));
}

// Crear respuesta offline
function createOfflineResponse() {
  return new Response(
    `<!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sin conexión - IPA Xerez</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #003366 0%, #004d99 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }
        .container {
          text-align: center;
          background: white;
          border-radius: 12px;
          padding: 40px;
          max-width: 500px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }
        h1 {
          color: #003366;
          margin-bottom: 16px;
          font-size: 28px;
        }
        p {
          color: #666;
          margin-bottom: 24px;
          line-height: 1.6;
        }
        .icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        button {
          background: #D4AF37;
          color: #003366;
          border: none;
          padding: 12px 32px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }
        button:hover {
          background: #FFD700;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">📡</div>
        <h1>Sin conexión a internet</h1>
        <p>Parece que no tienes conexión a internet. Algunos contenidos pueden estar disponibles en caché.</p>
        <button onclick="location.reload()">Reintentar</button>
      </div>
    </body>
    </html>`,
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/html; charset=UTF-8'
      })
    }
  );
}

// Sincronización en segundo plano
self.addEventListener('sync', event => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === 'sync-newsletter') {
    event.waitUntil(syncNewsletter());
  } else if (event.tag === 'sync-contact-form') {
    event.waitUntil(syncContactForm());
  }
});

async function syncNewsletter() {
  try {
    console.log('[SW] Syncing newsletter subscription...');
    // La sincronización real se haría aquí
    return Promise.resolve();
  } catch (error) {
    console.error('[SW] Newsletter sync failed:', error);
    return Promise.reject(error);
  }
}

async function syncContactForm() {
  try {
    console.log('[SW] Syncing contact form...');
    // La sincronización real se haría aquí
    return Promise.resolve();
  } catch (error) {
    console.error('[SW] Contact form sync failed:', error);
    return Promise.reject(error);
  }
}

// Notificaciones push
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Nuevo mensaje de IPA Xerez',
    icon: '/favicon-192.png',
    badge: '/favicon-192.png',
    tag: data.tag || 'notification',
    requireInteraction: data.requireInteraction || false,
    actions: [
      {
        action: 'open',
        title: 'Abrir',
        icon: '/favicon-192.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/favicon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'IPA Xerez', options)
  );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked:', event.action);
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(clientList => {
          // Buscar si ya hay una ventana abierta
          for (let client of clientList) {
            if (client.url === '/' && 'focus' in client) {
              return client.focus();
            }
          }
          // Si no hay ventana, abrir una nueva
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});

// Mensaje desde el cliente
self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
