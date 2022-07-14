/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const worker = self as unknown as ServiceWorkerGlobalScope;
const FILES = `cache${version}`;

const toCache = build.concat(files).filter((file) => !file.includes('/pages/api/oauth2/'));
const staticAssets = new Set(toCache);

worker.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(FILES)
			.then((cache) => cache.addAll(toCache))
			.then(() => {
				worker.skipWaiting();
			})
	);
});

worker.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(async (keys) => {
			for (const key of keys) {
				if (key !== FILES) await caches.delete(key);
			}
			worker.clients.claim();
		})
	);
});

async function fetchAndCache(request: Request) {
	const cache = await caches.open(`offline${version}`);

	try {
		const response = await fetch(request);
		cache.put(request, response.clone());
		return response;
	} catch (err) {
		const response = await cache.match(request);
		if (response) return response;
		throw err;
	}
}

worker.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET' || event.request.headers.has('range')) {
		return;
	}
	const url = new URL(event.request.url);

	const isDevServerRequest =
		url.hostname === self.location.hostname && url.port !== self.location.port;
	const isStaticAsset = url.host === self.location.host && staticAssets.has(url.pathname);
	const skipBecauseUncached = event.request.cache === 'only-if-cached' && !isStaticAsset;

	if (!isDevServerRequest && !skipBecauseUncached) {
		event.respondWith(
			(async () => {
				const cachedAsset = isStaticAsset && (await caches.match(event.request));
				return cachedAsset || fetchAndCache(event.request);
			})()
		);
	}
});
