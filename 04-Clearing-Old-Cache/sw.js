const filesToCache = [
	'/',
	'/index.html'
];

const cacheName = 'static-v1';

/* 1) install
 * 成功 Cache Assets 之後，再進入 fetch 事件、攔截 Fetch Requests 並將 response 存入 Cache。
 * 接著會遇到一個問題：發現 Fetch 到的資料會一直被 Cache 住，不會自動更新，所以我們必須清除舊的 Cache。
 */
self.addEventListener('install', event => {
	console.log('installing…');
	event.waitUntil(
		caches.open(cacheName).then(cache => {
			return cache.addAll(filesToCache);
		})
	);
});

/* 2) activate
 * Service Worker 有一個 activate 事件，會去 handle fetches。
 * 進到 activate 事件之後，一定要執行 event.waitUntil();
 * 這個方法會等 caches.keys().then 執行結束後 activate 的 event 才會真的結束。
 */
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
/* 3)
 * caches.keys() 是 caches 的 API，負責的工作是把所有的 cacheName 取出來，
 * 回傳的 cacheNames 是個 Array，是一個 Array、裡面的元素是 String，
 * 例如：cacheName 會是 ['static-v1', 'static-v1-api'] 。
 *
 * 接著 cacheNames.map 產生 Array，
 * map 出來的 item 去判斷 是不是等於 cacheName，如果不等於就刪除 cached 檔案。
 *
 * Promise.all 的意思是等到 promiseArr 這個陣列所有的 promise 物件結束後，才可以繼續執行回傳的動作。
 *
 * 最後只要 fetch 資料發生改變，就會觸發 activate 事件，
 * 並刪除舊的 Cache，接著取得新的 fetch 資料，畫面上的資料就會是最新的
 */

// fetch
self.addEventListener('fetch', event => {
    console.log('now fetch!');
});
