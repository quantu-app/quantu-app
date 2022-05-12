import EventEmitter from 'eventemitter3';
import { derived, get, writable } from 'svelte/store';

const onlineWritable = writable(typeof navigator === 'object' ? navigator.onLine : false);

export const onlineEmitter = new EventEmitter<{ online: () => void; offline: () => void }>();

export const online = derived(onlineWritable, (online) => online);

export function isOnline() {
	return get(online);
}

function onOnline() {
	onlineWritable.set(true);
	onlineEmitter.emit('online');
}

function onOffline() {
	onlineWritable.set(false);
	onlineEmitter.emit('offline');
}

if (typeof window === 'object') {
	window.addEventListener('online', onOnline);
	window.addEventListener('offline', onOffline);
}
