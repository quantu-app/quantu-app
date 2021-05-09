import { uuid } from 'automerge';
import { forage } from '@tauri-apps/tauri-forage';

let ACTOR_ID: string | undefined;

const ACTOR_ID_KEY = 'actor_id',
	events: Array<(actorId: string) => void> = [];

export function getActorId() {
	return new Promise<string>((resolve) => (ACTOR_ID ? resolve(ACTOR_ID) : events.push(resolve)));
}

(async function () {
	let actorId = await forage.getItem({ key: ACTOR_ID_KEY })();

	if (!actorId) {
		actorId = uuid();
		await forage.setItem({ key: ACTOR_ID_KEY, value: actorId })();
	}

	ACTOR_ID = actorId;

	events.forEach((event) => event(actorId));
	events.length = 0;
})();
