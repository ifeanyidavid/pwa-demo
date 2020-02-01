// const staticCacheName = "site-static";
const staticCacheName = "site-static-v1";
const dynamicCacheName = "site-dynamic-v1";
const criticalAssets = [
  "/",
  "/index.html",
  "/pwa-task.js",
  "/styles.css",
  "/manifest.json",
  "/assets/icons/apple-icon-57x57.png",
  "/assets/icons/apple-icon-60x60.png",
  "/assets/icons/apple-icon-72x72.png",
  "/assets/icons/apple-icon-76x76.png",
  "/assets/icons/apple-icon-114x114.png",
  "/assets/icons/apple-icon-120x120.png",
  "/assets/icons/apple-icon-144x144.png",
  "/assets/icons/apple-icon-152x152.png",
  "/assets/icons/apple-icon-180x180.png",
  "/assets/icons/android-icon-192x192.png",
  "/assets/icons/favicon-32x32.png",
  "/assets/icons/favicon-96x96.png",
  "/assets/icons/favicon-16x16.png",
  "/assets/icons/ms-icon-144x144.png",
  "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
  "http://5e0df4b536b80000143db9ca.mockapi.io/etranzact/v1/article",
  "/fallback.html"
];

const addToCache = (request, response) => {
  caches.open(dynamicCacheName).then(cache => cache.put(request, response));
};

// Cache versioning
const clearOldCaches = () => {
  return caches.keys().then(keys => {
    return Promise.all(
      keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => {
          caches.delete(key);
        })
    );
  });
};

// Cache size limit
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// Cache resources
self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(staticCacheName)
      .then(cache => {
        cache.addAll(criticalAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate service worker
self.addEventListener("activate", event => {
  event.waitUntil(clearOldCaches().then(() => self.clients.claim()));
});

// Fetch event
self.addEventListener("fetch", event => {
  /* event.respondWith(
    caches.match(event.request).then(function(response) {
      return (
        (response &&
          new Promise(resolve => {
            // Resolve the response
            resolve(response);

            // Fetch the request
            fetch(event.request).then(res => {
              // And cache it
              addToCache(event.request, res);
            });
          })) ||
        fetch(event.request)
          .then(res => {
            let clone = res.clone();
            addToCache(event.request.url, clone);
            limitCacheSize(dynamicCacheName, 32);
            return res;
          })
          .catch(() => {
            if (event.request.url.indexOf(".html") > -1) {
              return caches.match("/fallback.html");
            }
          })
      );
    })
  ); */
});
