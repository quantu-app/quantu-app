import { debounce } from '@aicacia/debounce';
import { forage } from '@tauri-apps/tauri-forage';
import { EventEmitter } from 'eventemitter3';
import { get, Subscriber, Updater, writable, Writable } from 'svelte/store';

// tslint:disable-next-line: interface-name
export interface PersistentStore<T> {
	on(event: 'persist', listener: (doc: T) => void): this;
	off(event: 'persist', listener: (doc: T) => void): this;
}

export class PersistentStore<T> extends EventEmitter implements Writable<T> {
	protected name: string;
	protected store: Writable<T>;
	protected initialized = false;
	protected saved = false;
	protected updaters: Updater<T>[] = [];
	protected debouncedPersist: () => void;

	constructor(name: string, initialState: T, timeoutMS = 5000) {
		super();
		this.name = name;
		this.store = writable(initialState);
		this.init();
		this.debouncedPersist = debounce(this.persist, timeoutMS, {
			after: () => (this.saved = true),
			before: () => (this.saved = false)
		});
	}

	private async init() {
		try {
			const raw: string = await forage.getItem({ key: this.name })();

			if (raw) {
				this.store.set(this.fromString(raw));
			}
		} catch (error) {
			console.error(error);
		}

		const updaters = [...this.updaters];
		this.updaters.length = 0;

		if (updaters.length) {
			updaters.forEach((updater) => this.store.update(updater));
			this.debouncedPersist();
		}

		this.initialized = true;
	}

	async close() {
		await this.persist();
		return this;
	}

	protected persist = () => {
		if (!this.saved) {
			forage.setItem({ key: this.name, value: this.toString() })();
			this.saved = true;
		}
	};

	get() {
		return get(this.store);
	}
	set(value: T) {
		return this.update(() => value);
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

	toString() {
		return JSON.stringify(this.get());
	}

	fromString(str: string): T {
		return JSON.parse(str);
	}
}
