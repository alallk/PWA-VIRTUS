(function () {
    'use strict';

    var  CACHE_SHELL = 'pwa-news-shell-v1';

    var FILES_CACHE = [
        '/css/main.css'
        // 'cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js',
        // 'bootstrap.min.js',
        // 'moment.min.js',
        // 'api.js',
        // 'bootstrap.min.css'
    ];

    self.addEventListener('install', function (e) {
       e.waitUntil(
           self.caches.open(CACHE_SHELL)
               .then(function (cache) {
                    return cache.addAll(FILES_CACHE);
               })
       );
    });

    self.addEventListener('fetch', function (e) {
        e.respondWith(
            caches.match(e.request)
                .then(function (response) {
                    if(response) return response;
                    return fetch(e.request);
                })
        )
    })

}());