'use strict';
const CACHE_STATIC = 'static-cache-v1';

function handleInstall(e) {
  async function cacheStaticFiles() {
    const files = [
      './',
      './manifest.json',
      './favicon.svg',
      './index.html',
      './normalize.css',
      './style.css',
      './sw.js',
      './Tasks.js',
      './DB.js',
      './font/FiraSans-Bold.ttf',
      './font/FiraSans-Regular.ttf',
      './img/arrow-left.svg',
      './img/check-square.svg',
      './img/edit.svg',
      './img/plus.svg',
      './img/save.svg',
      './img/square.svg',
      './img/trash.svg',
    ]
    const cacheStat = await caches.open(CACHE_STATIC)
    await Promise.all(
      files.map(function (url) {
        return cacheStat.add(url).catch(function (reason) {
          console.log(`'${url}' failed: ${String(reason)}`)
        });
      })
    );
  }

  //  wait until all static files will be cached
  e.waitUntil(cacheStaticFiles())
}

function handleFetch(e) {
  async function getFromCache() {
    const cache = await self.caches.open(CACHE_STATIC)
    const cachedResponse = await cache.match(e.request)
    if (cachedResponse) {
      return cachedResponse
    }
    // wait until resource will be fetched from server and stored in cache
    const resp = await fetch(e.request)
    await cache.put(e.request, resp.clone())
    return resp
  }

  e.respondWith(getFromCache())
}

self.addEventListener('install', handleInstall)
self.addEventListener('fetch', handleFetch)
