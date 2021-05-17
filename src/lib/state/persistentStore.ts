import { forage } from '@tauri-apps/tauri-forage';
import { debounce } from '@aicacia/debounce';
import { get, Subscriber, Updater, writable, Writable } from 'svelte/store';

class PersistentStore<T> implements Writable<T> {
	private name: string;
	private store: Writable<T>;
	private initialized = false;
	private updaters: Updater<T>[] = [];
	private debouncedPersist: () => void;

	constructor(name: string, initialState: T, timeoutMS = 5000) {
		this.name = name;
		this.store = writable(initialState);
		this.init();
		this.debouncedPersist = debounce(this.persist, timeoutMS);
	}

	private async init() {
		const json = await forage.getItem({ key: this.name })();

		if (json) {
			this.store.set(JSON.parse(json));
		}

		const updaters = this.updaters.slice();
		this.updaters.length = 0;
		updaters.forEach((updater) => this.store.update(updater));
		this.debouncedPersist();

		this.initialized = true;
	}

	private async persist() {
		await forage.setItem({ key: this.name, value: JSON.stringify(this.get()) })();
	}

	get() {
		return get(this.store);
	}
	set(state: T) {
		this.update(() => state);
		return this;
	}
	update(updater: Updater<T>) {
		if (this.initialized) {
			this.store.update(updater);
			this.debouncedPersist();
		} else {
			this.updaters.push(updater);
		}
		return this;
	}
	subscribe(subscriber: Subscriber<T>, invalidate?: (value?: T) => void) {
		return this.store.subscribe(subscriber, invalidate);
	}
}

export function persistentStore<T>(name: string, initialState: T, timeoutMS = 5000) {
	return new PersistentStore<T>(name, initialState, timeoutMS);
}
