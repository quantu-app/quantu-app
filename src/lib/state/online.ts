import EventEmitter from 'eventemitter3';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';

const { set, subscribe } = writable(typeof navigator === 'object' ? navigator.onLine : false);

export const onlineEmitter = new EventEmitter<{ online: () => void; offline: () => void }>();

export const online: Readable<boolean> = { subscribe };

export function isOnline() {
	return get(online);
}

function onOnline() {
	set(true);
	onlineEmitter.emit('online');
}

function onOffline() {
	set(false);
	onlineEmitter.emit('offline');
}

if (typeof window === 'object') {
	window.addEventListener('online', onOnline);
	window.addEventListener('offline', onOffline);
}
