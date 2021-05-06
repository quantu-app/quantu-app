import Automerge from 'automerge';
import { forage } from '@tauri-apps/tauri-forage';
import { debounce } from '@aicacia/debounce';
import { getActorId } from './actorId';
import { get, writable } from 'svelte/store';

export function persistentStore<T>(name: string, defaults: T, timeoutMS = 5000) {
	const store = writable<Automerge.FreezeObject<T>>(Automerge.from(defaults));

	const events: Array<() => void> = [];

	async function persist() {
		await forage.setItem({ key: name, value: Automerge.save(get(store)) })();
	}

	const debouncedPersist = debounce(persist, timeoutMS);

	function internalChange(changeFn: Automerge.ChangeFn<T>) {
		store.update((doc) => Automerge.change(doc, changeFn));
		debouncedPersist();
	}

	function change(changeFn: Automerge.ChangeFn<T>) {
		if (events.length) {
			events.push(() => {
				internalChange(changeFn);
			});
		} else {
			internalChange(changeFn);
		}
	}

	(async function init() {
		const [actorId, raw] = await Promise.all([getActorId(), forage.getItem({ key: name })()]);

		if (raw) {
			store.set(Automerge.load(raw, actorId));
		}

		events.forEach((event) => event());
		events.length = 0;
	})();

	return {
		subscribe: store.subscribe,
		get: () => get(store),
		change
	};
}
