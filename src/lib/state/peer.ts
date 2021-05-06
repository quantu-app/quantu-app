import type { Peer } from '@aicacia/peer';
import { getActorId } from './actorId';
import { writable, get } from 'svelte/store';

const store = writable<Peer>(null);

export const peer = {
	subscribe: store.subscribe,
	get: () => get(store)
};

const events: Array<(peer: Peer) => void> = [],
	APP_ID = 'com-books-aicacia-';

export function getAppId(id: string) {
	return `${APP_ID}${id}`;
}

export function getIdFromAppId(appId: string) {
	return appId.slice(APP_ID.length);
}

export function getPeer() {
	return new Promise<Peer>((resolve) => (peer.get() ? resolve(peer.get()) : events.push(resolve)));
}

if (typeof window === 'object') {
	(async function () {
		const { Peer: AicaciaPeer } = await import('@aicacia/peer'),
			peer = new AicaciaPeer(new (window as any).Peer(getAppId(await getActorId())));

		store.set(peer);

		events.forEach((event) => event(peer));
		events.length = 0;
	})();
}
