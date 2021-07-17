declare const self: ServiceWorkerGlobalScope;

import { build, files, timestamp } from '$service-worker';

const CACHE_NAME = `static-cache-v${timestamp}`;
const FILES_TO_CACHE = [...build, ...files];

self.addEventListener('install', (evt) => {
	console.log('[ServiceWorker] Install');

	evt.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log('[ServiceWorker] Pre-caching offline page');
			return cache.addAll(FILES_TO_CACHE);
		})
	);

	self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
	console.log('[ServiceWorker] Activate');
	evt.waitUntil(
		caches.keys().then((keyList) =>
			Promise.all(
				keyList.map((key) => {
					if (key !== CACHE_NAME) {
						console.log('[ServiceWorker] Removing old cache', key);
						return caches.delete(key);
					}
				})
			)
		)
	);

	self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
	console.log('[ServiceWorker] Fetch', evt.request.url);
	if (evt.request.mode !== 'navigate') {
		return;
	}
	evt.respondWith(
		fetch(evt.request).catch(() =>
			caches.open(CACHE_NAME).then((cache) => cache.match('offline.html'))
		)
	);
});
