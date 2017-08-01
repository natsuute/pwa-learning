/* 01)
 * 建立一個陣列，名稱為 filesToCache，這個陣列中會存放所有靜態檔案的 URL。
 */
const filesToCache = [
	'/',
	'/index.html'
];

/* 02) install
 * 使用 waitUntil 方法去等待 cache 成功後再進入到下一個階段。
 * 自訂一個 cache 名稱為 static-v1，透過 caches.open 取得 static-v1 的 cache object，
 * 再把我們前面定義的陣列(filesToCache) 存入 cache object。
 */
self.addEventListener('install', event => {
	console.log('installing…');
	event.waitUntil(
		caches.open('static-v1').then(cache => {
			return cache.addAll(filesToCache);
		})
	);
});
/* 03) 這時就可以透過 chrome 的 devtools （Application > Cache Storage）看到我們儲存的資料 */

// activate
self.addEventListener('activate', event => {
    console.log('now ready to handle fetches!');
});

// fetch
self.addEventListener('fetch', event => {
    console.log('now fetch!');
});
