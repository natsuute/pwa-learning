const filesToCache = [
	'/',
	'/index.html'
];

const cacheName = 'static-v1';

// install
self.addEventListener('install', event => {
	console.log('installing…');
	event.waitUntil(
		caches.open(cacheName).then(cache => {
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

/* 1) fetch
 * 如何攔截 Requests？
 * 到 fetch 事件裡面去 console 對應的 request 資訊。
 * 藉由 Service Worker 的 fetch 事件，我們可以成功攔截到 request 相關資訊。
 */
self.addEventListener('fetch', event => {
	console.log('now fetch!');
	// console.log('event.request:', event.request);
	// console.log('[ServiceWorker] Fetch', event.request.url);

	const dataUrl = 'http://localhost:3000';
	// 回傳 Response
	event.respondWith(
		// 透過 caches.match() 這個方法裡面帶一個參數，放入 request，就可以去配對 event.request。
		caches.match(event.request).then(function (response) {
			return response || fetch(event.request).then(res =>
				// 存 caches 之前，要先打開 caches.open(dataCacheName)
				caches.open(dataCacheName)
				.then(function(cache) {
					// cache.put(key, value)
					// 下一次 caches.match 會對應到 event.request
					cache.put(event.request, res.clone());
					return res;
				})
			);
		})
	);

});
