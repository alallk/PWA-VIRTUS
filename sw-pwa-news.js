(function () {
    'use strict';
    var API = 'https://newsapi.org/v2/';
    var VERSION = 1;

    var CACHE_REQUEST = 'pwa-news-req-v' + VERSION;
    var CACHE_SHELL = 'pwa-news-shell-v' + VERSION;

    var FILES_TO_CACHE = [
        '/',
        '/css/responsive.min.css',
        '/node_modules/jquery/dist/jquery.min.js',
        '/node_modules/moment/min/moment.min.js',
        '/node_modules/moment/min/locales.min.js',
        '/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
        '/node_modules/jquery-lazy/jquery.lazy.min.js',
        '/node_modules/jquery-lazy/jquery.lazy.plugins.min.js',
        '/js/api.js',
        '/js/bind.js',
        '/images/item_sem_imagem.svg',
        '/images/tenor.gif',
        '/images/rss-icon.png',
        '/images/icon-72x72.png',
        '/images/icon-96x96.png',
        '/images/icon-128x128.png',
        '/images/icon-144x144.png',
        '/images/icon-152x152.png',
        '/images/icon-192x192.png',
        '/images/icon-384x384.png',
        '/images/icon-512x512.png',
        '/manifest.json'
    ];

    self.addEventListener('install', function (e) {
       e.waitUntil(
           self.caches.open(CACHE_SHELL)
               .then(function (cache) {
                    return cache.addAll(FILES_TO_CACHE);
               })
       );
    });

    self.addEventListener('activate', function (e) {
        var cacheWhitelist = [CACHE_REQUEST, CACHE_SHELL];
        e.waitUntil(
            caches.keys().then(function (cacheNames) {
                return Promise.all(
                    cacheNames.map(function (cacheName) {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        );
    });

    self.addEventListener('fetch', function (event) {
        if (event.request.url.indexOf(API) === -1) {
            event.respondWith(
                caches.match(event.request).then(function (response) {
                    return response || fetch(event.request)
                })
            );
        } else {
            event.respondWith(
                fetch(event.request).then(function (response) {
                    return caches.open(CACHE_REQUEST).then(function (cache) {
                        cache.put(event.request, response.clone());
                        return response;
                    })
                }).catch(function (err) {
                    console.error(err);
                    return caches.match(event.request);
                })
            );
        }
    });

    self.addEventListener('push', function(e){
        console.log('[Service Worker] Push Received.');
        console.log('[Service Worker] Push had this data: ' + e.data.text());

        var title = 'Push PWA News';
        var options = {
            body: e.data.text(),
            icon: '/images/icon-512x512.png',
            badge: '/images/icon-512x512.png'
        };
        e.waitUntil(
            self.registration.showNotification(title, options)
        );
    });
}());