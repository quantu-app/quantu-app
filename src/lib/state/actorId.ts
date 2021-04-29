import { uuid } from 'automerge';
import { forage } from '@tauri-apps/tauri-forage';
import { none } from '@aicacia/core';

const ACTOR_ID = none<string>(),
	ACTOR_ID_KEY = 'actor_id',
	events: Array<(actorId: string) => void> = [];

export function getActorId() {
	return new Promise<string>((resolve) =>
		ACTOR_ID.ifSome(resolve).ifNone(() => events.push(resolve))
	);
}

(async function () {
	let actorId = await forage.getItem({ key: ACTOR_ID_KEY })();

	if (!actorId) {
		actorId = uuid();
		await forage.setItem({ key: ACTOR_ID_KEY, value: actorId });
	}

	ACTOR_ID.replace(actorId);

	events.forEach((event) => event(actorId));
	events.length = 0;
})();
