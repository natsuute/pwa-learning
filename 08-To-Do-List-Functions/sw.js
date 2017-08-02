const filesToCache = [
    '/',
    '/assets/images/btn_check.png',
    '/assets/images/btn_del.png',
    '/assets/images/ic_add.png',
    '/assets/images/logo_todo.png',
    '/src/main.css',
    '/index.html'
];

const cacheName = 'todolist-v1';

// install
self.addEventListener('install', event => {
    console.log('installing…');
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('Caching app ok');
            return cache.addAll(filesToCache);
        })
    );
});

// activate
self.addEventListener('activate', event => {
	console.log('now ready to handle fetches!');
	  event.waitUntil(
		caches.keys().then(function(cacheNames) {
			var promiseArr = cacheNames.map(function(item) {
				if (item !== cacheName) {
					// Delete that cached file
					return caches.delete(item);
				}
			})
			return Promise.all(promiseArr);
		})
	); // end e.waitUntil
});

// fetch
self.addEventListener('fetch', event => {
	console.log('now fetch!');
	const dataUrl = 'http://localhost:3000';
	event.respondWith(
		caches.match(event.request).then(function (response) {
			return response || fetch(event.request).then(res =>
				caches.open(cacheName)
				.then(function(cache) {// dataCacheName
					cache.put(event.request.url, res.clone());
					return res;
				})
			);
		})
	);

});
