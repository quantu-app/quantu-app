import { browser } from '$app/env';
import { derived, writable } from 'svelte/store';

const nowWritable = writable(Date.now());

export const now = derived(nowWritable, (now) => now);

function onUpdate() {
	nowWritable.set(Date.now());
	setTimeout(onUpdate, 1000);
}

if (browser) {
	onUpdate();
}
