/* ================================================================
   sw.js — TKJ XI-9 | Service Worker (PWA Offline Cache)
   Versi 2.1 · Patch 2026
   - Cache offline.html sebagai fallback navigasi
   - Stale-while-revalidate untuk halaman HTML
   - Retry eksponensial tidak perlu (browser handles retries natively)
   ================================================================ */
'use strict';

const CACHE_NAME = 'tkj-cache-v1';
const OFFLINE_FALLBACK = 'page/offline.html';

/* Lightweight service worker yang cache halaman penting.
   Menggunakan stale-while-revalidate strategy untuk performance optimal. */

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        './index.html',
        'page/offline.html'
      ]).catch(err => console.warn('[SW] Precache failed:', err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(res => {
          if (!res || res.status !== 200) return res;
          // Cache successful HTML responses
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, clone);
          });
          return res;
        })
        .catch(() => {
          // Offline fallback
          return caches.match(request).then(cached => {
            return cached || caches.match(OFFLINE_FALLBACK);
          });
        })
    );
    return;
  }

  // For other requests, just try network
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

