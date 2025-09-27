const CACHE_NAME = "db-vekariya-v1";
const urlsToCache = [
  "/",
  "/login",
  "/dashboard",
  "/favicon.ico",
  "/favicon.svg",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/site.webmanifest",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip API routes completely - let them pass through to network
  if (url.pathname.startsWith("/api/")) {
    return; // Don't intercept API requests
  }

  // For non-API requests, use cache-first strategy
  event.respondWith(
    caches.match(request).then((response) => {
      // Return cached version if available
      if (response) {
        return response;
      }

      // Fetch from network
      return fetch(request).catch(() => {
        // If offline and no cache, return offline page for navigation requests
        if (request.mode === "navigate") {
          return caches.match("/offline.html");
        }

        // For other requests, return a basic offline response
        return new Response("Offline", { status: 503 });
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
