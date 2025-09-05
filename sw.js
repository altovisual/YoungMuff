// Service Worker Avanzado para YOUNGMUFF PWA
const CACHE_NAME = 'youngmuff-v2.0';
const STATIC_CACHE = 'youngmuff-static-v2.0';
const DYNAMIC_CACHE = 'youngmuff-dynamic-v2.0';
const AUDIO_CACHE = 'youngmuff-audio-v2.0';
const IMAGE_CACHE = 'youngmuff-images-v2.0';

// URLs críticas para cachear inmediatamente
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.png',
  '/images/logo.png',
  '/images/logo-md.png',
  '/images/logo-full.png',
  '/css/pwa-styles.css',
  '/offline.html'
];

// Estrategias de cache
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Configuración de rutas y estrategias
const ROUTE_STRATEGIES = [
  { pattern: /\.(js|css|woff2?|ttf|eot)$/, strategy: CACHE_STRATEGIES.CACHE_FIRST, cache: STATIC_CACHE },
  { pattern: /\.(png|jpg|jpeg|gif|webp|svg|ico)$/, strategy: CACHE_STRATEGIES.CACHE_FIRST, cache: IMAGE_CACHE },
  { pattern: /\.(mp3|wav|ogg|m4a|aac|flac)$/, strategy: CACHE_STRATEGIES.CACHE_FIRST, cache: AUDIO_CACHE },
  { pattern: /\/api\/tracks/, strategy: CACHE_STRATEGIES.NETWORK_FIRST, cache: DYNAMIC_CACHE },
  { pattern: /\/api\//, strategy: CACHE_STRATEGIES.NETWORK_ONLY },
  { pattern: /\/$/, strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE, cache: DYNAMIC_CACHE }
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Activar inmediatamente el nuevo SW
      self.skipWaiting()
    ])
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Limpiar caches antiguos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== AUDIO_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Tomar control de todas las pestañas
      self.clients.claim()
    ])
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requests que no son HTTP/HTTPS
  if (!request.url.startsWith('http')) return;
  
  // Encontrar estrategia para esta request
  const route = ROUTE_STRATEGIES.find(route => route.pattern.test(request.url));
  
  if (route) {
    event.respondWith(handleRequest(request, route));
  } else {
    // Estrategia por defecto: network first
    event.respondWith(handleRequest(request, { 
      strategy: CACHE_STRATEGIES.NETWORK_FIRST, 
      cache: DYNAMIC_CACHE 
    }));
  }
});

// Manejar requests según estrategia
async function handleRequest(request, route) {
  const { strategy, cache: cacheName } = route;
  
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, cacheName);
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, cacheName);
    
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, cacheName);
    
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return fetch(request);
    
    case CACHE_STRATEGIES.CACHE_ONLY:
      return caches.match(request);
    
    default:
      return networkFirst(request, cacheName);
  }
}

// Estrategia Cache First
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, serving offline page');
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    throw error;
  }
}

// Estrategia Network First
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && cacheName) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache');
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    throw error;
  }
}

// Estrategia Stale While Revalidate
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Actualizar en background
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Notificaciones Push
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  const options = {
    body: 'Nueva música disponible en YOUNGMUFF',
    icon: '/images/logo.png',
    badge: '/images/logo.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'play',
        title: 'Reproducir',
        icon: '/images/play-icon.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/images/close-icon.png'
      }
    ],
    requireInteraction: true,
    silent: false
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.data = { ...options.data, ...data };
  }
  
  event.waitUntil(
    self.registration.showNotification('YOUNGMUFF', options)
  );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'play') {
    event.waitUntil(
      clients.openWindow('/?action=play&track=' + (data.trackId || ''))
    );
  } else if (action === 'close') {
    // Solo cerrar la notificación
    return;
  } else {
    // Click en el cuerpo de la notificación
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // Si ya hay una ventana abierta, enfocarla
        for (let client of clientList) {
          if (client.url === self.location.origin && 'focus' in client) {
            return client.focus();
          }
        }
        // Si no hay ventana abierta, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Background Sync para reproducción offline
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-tracks') {
    event.waitUntil(syncTracks());
  }
});

async function syncTracks() {
  try {
    const response = await fetch('/api/tracks');
    if (response.ok) {
      const tracks = await response.json();
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put('/api/tracks', new Response(JSON.stringify(tracks)));
      
      // Notificar a los clientes que los tracks se han actualizado
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({ type: 'TRACKS_SYNCED', tracks });
      });
    }
  } catch (error) {
    console.log('[SW] Sync failed:', error);
  }
}

// Manejar compartir contenido
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHARE_TRACK') {
    const { track } = event.data;
    
    // Preparar datos para compartir
    const shareData = {
      title: `${track.title} - YOUNGMUFF`,
      text: `Escucha "${track.title}" en YOUNGMUFF`,
      url: `${self.location.origin}/?track=${track.id}`
    };
    
    // Enviar de vuelta al cliente
    event.ports[0].postMessage({ shareData });
  }
});

// Precaching de audio crítico
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRECACHE_AUDIO') {
    const { audioUrls } = event.data;
    event.waitUntil(precacheAudio(audioUrls));
  }
});

async function precacheAudio(audioUrls) {
  const cache = await caches.open(AUDIO_CACHE);
  
  for (const url of audioUrls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
        console.log('[SW] Audio cached:', url);
      }
    } catch (error) {
      console.log('[SW] Failed to cache audio:', url, error);
    }
  }
}

// Limpiar caches cuando sea necesario
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearCaches());
  }
});

async function clearCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('[SW] All caches cleared');
}