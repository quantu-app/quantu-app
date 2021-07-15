import { EventEmitter } from 'eventemitter3';
import { Readable, get, writable } from 'svelte/store';

const { set, subscribe } = writable(false);
export const emitter = new EventEmitter<{ online: () => void; offline: () => void }>();

export const online: Readable<boolean> = { subscribe };

export function isOnline() {
	return get(online);
}

function onOnline() {
	set(true);
	emitter.emit('online');
}

function onOffline() {
	set(false);
	emitter.emit('offline');
}

if (typeof window === 'object') {
	window.addEventListener('online', onOnline);
	window.addEventListener('offline', onOffline);
}
