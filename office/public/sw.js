// Minimal service worker: it exists so Chrome/Android treats the app as installable, and it shows a
// friendly page when the phone is offline.
//
// It deliberately does NOT cache the app's pages or scripts. This app is deployed several times a day and
// a stale cache would leave people looking at an old screen with no way to tell. Only offline.html is
// cached; every other request goes straight to the network.

const CACHE = "so-shell-v1";
const OFFLINE = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.add(OFFLINE)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || req.mode !== "navigate") return;
  event.respondWith(fetch(req).catch(() => caches.match(OFFLINE).then((hit) => hit || Response.error())));
});
