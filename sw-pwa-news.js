(function () {
    'use strict';
    var VERSION = 3;

    var CACHE_REQUEST = 'pwa-news-req-v' + VERSION;
    var CACHE_SHELL = 'pwa-news-shell-v' + VERSION;

    var FILES_TO_CACHE = [
        '/',
        '/css/responsive.min.css',
        '/bower_components/jquery/dist/jquery.min.js',
        '/bower_components/moment/moment.js',
        '/bower_components/bootstrap/dist/js/bootstrap.bundle.min.js',
        '/js/api.js',
        '/images/item_sem_imagem.svg',
        '/images/tenor.gif'
    ];

    self.addEventListener('install', function (e) {
       e.waitUntil(
           self.caches.open(CACHE_SHELL)
               .then(function (cache) {
                    return cache.addAll(FILES_TO_CACHE);
               })
       );
    });

    self.addEventListener('activate', event => {
        const cacheWhitelist = [CACHE_REQUEST, CACHE_SHELL];
        event.waitUntil(
            caches.keys().then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        );
    });

    self.addEventListener('fetch', function(event) {
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {

                    // Cache hit - return response
                    if (response) {
                        return response;
                    }

                    var fetchRequest = event.request.clone();

                    return fetch(fetchRequest).then(
                        function(response) {
                            // Check if we received a valid response
                            if(!response || response.status !== 200) {
                                return response;
                            }

                            // IMPORTANT: Clone the response. A response is a stream
                            // and because we want the browser to consume the response
                            // as well as the cache consuming the response, we need
                            // to clone it so we have two streams.
                            var responseToCache = response.clone();

                            caches.open(CACHE_REQUEST)
                                .then(function(cache) {
                                    cache.put(event.request, responseToCache);
                                });

                            return response;
                        }
                    );
                })
        );
    });

}());