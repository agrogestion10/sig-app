// SIG · Service worker: guarda una copia de la aplicación para que abra sin señal.
// Los datos no pasan por aquí: los maneja la aplicación (copia local y bandeja de salida).
const CACHE = 'sig-app-4';
const BASE = ['/', '/manifest.webmanifest', '/iconos/ag-192.png', '/iconos/ag-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('sig-app-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const propio = u => u.origin === self.location.origin || u.hostname === 'cdn.jsdelivr.net';

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (!propio(u)) return; // Supabase, Kobo y lo demás van directo a la red
  const esPagina = r.mode === 'navigate';
  // Primero la red (para tener siempre lo último); sin señal, la copia guardada
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    try {
      // La página se pide sin la memoria del navegador, para que una versión nueva se vea apenas se publica
      const resp = await fetch(esPagina ? new Request(r.url, { cache: 'no-cache', credentials: r.credentials }) : r);
      // Solo la página de la aplicación se guarda como «/»; la página pública (/inicio/) se guarda aparte
      const esApp = !esPagina || u.pathname === '/' || u.pathname === '/index.html';
      if (resp && resp.ok && (resp.type === 'basic' || resp.type === 'cors')) c.put(esPagina && esApp ? '/' : r, resp.clone());
      return resp;
    } catch (err) {
      const guardada = await c.match(esPagina && u.pathname !== '/inicio/' ? '/' : r) || await c.match(r, { ignoreSearch: true });
      if (guardada) return guardada;
      throw err;
    }
  })());
});
