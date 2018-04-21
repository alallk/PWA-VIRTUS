(function () {
    'use strict';
    var API = 'https://newsapi.org/v2/';
    var VERSION = 1;
    var pubKey = 'BHC3zRxe5gfgcBjDZvt5LBhIv827PpN2paxfWVdYW8-KTxhdFBngLsCiPNeq5ekmLMQtbP40Y2-fGlJBI0dlp4s';

    var CACHE_REQUEST = 'pwa-news-req-v' + VERSION;
    var CACHE_SHELL = 'pwa-news-shell-v' + VERSION;

    var FILES_TO_CACHE = [
        '/',
        '/css/responsive.min.css',
        '/node_modules/jquery/dist/jquery.min.js',
        '/node_modules/moment/min/moment.min.js',
        '/node_modules/moment/min/locales.min.js',
        // '/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
        '/js/api.js',
        '/js/bind.js',
        '/images/item_sem_imagem.svg',
        '/images/tenor.gif',
        '/images/rss-icon.png',
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

    //UTILS
    function urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}());