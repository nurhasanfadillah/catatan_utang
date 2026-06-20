const CACHE_NAME = 'keuangan-produksi-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://aistudiocdn.com/react@^19.2.1',
  'https://aistudiocdn.com/react-dom@^19.2.1/',
  'https://aistudiocdn.com/lucide-react@^0.556.0',
  'https://esm.sh/jspdf@2.5.1',
  'https://esm.sh/jspdf-autotable@3.8.1'
];

// Install Service Worker & Cache Static Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate & Cleanup Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // 1. Network Only untuk Vercel API Routes (data selalu realtime)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 2. Navigation Fallback (SPA Routing Handler)
  // Jika user merefresh halaman atau mengakses deep link saat offline, kembalikan index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then((response) => {
        return response || fetch(event.request).catch(() => {
            return caches.match('/index.html');
        });
      })
    );
    return;
  }

  // 3. Stale-While-Revalidate / Cache First fallback untuk aset statis
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Return dari cache
      }
      return fetch(event.request).then((response) => {
        // Validasi respon sebelum cache
        if (!response || response.status !== 200 || response.type !== 'basic' && !response.url.startsWith('http')) {
          return response;
        }

        // Cache respon baru
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});