import { debounce } from '@aicacia/debounce';
import { forage } from '@tauri-apps/tauri-forage';
import Automerge from 'automerge';
import { EventEmitter } from 'eventemitter3';
import type { ChangeFn, Doc, BinaryDocument } from 'automerge';
import { get, Readable, Subscriber, writable, Writable } from 'svelte/store';

// tslint:disable-next-line: interface-name
export interface AutomergePersistentStore<T> {
	on(event: 'persist', listener: (doc: Doc<T>) => void): this;
	off(event: 'persist', listener: (doc: Doc<T>) => void): this;
}

export class AutomergePersistentStore<T> extends EventEmitter implements Readable<Doc<T>> {
	protected name: string;
	protected store: Writable<Doc<T>>;
	protected initialized = false;
	protected saved = false;
	protected changeFns: ChangeFn<T>[] = [];
	protected debouncedPersist: () => void;

	constructor(name: string, initialState: Doc<T>, timeoutMS = 5000) {
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

		const changeFns = [...this.changeFns];
		this.changeFns.length = 0;
		if (changeFns.length) {
			changeFns.forEach((changeFn) => this.store.update((doc) => Automerge.change(doc, changeFn)));
			this.debouncedPersist();
		}

		this.initialized = true;
	}

	async close() {
		await this.persist();
		this.removeAllListeners();
		return this;
	}

	protected persist = () => {
		if (!this.saved) {
			forage.setItem({ key: this.name, value: this.toString() })();
			this.saved = true;
			this.emit('persist', this.get());
		}
	};

	get() {
		return get(this.store);
	}
	change(changeFn: ChangeFn<T>) {
		if (this.initialized) {
			this.store.update((doc) => Automerge.change(doc, changeFn));
			this.debouncedPersist();
		} else {
			this.changeFns.push(changeFn);
		}
		return this;
	}
	subscribe(subscriber: Subscriber<Doc<T>>, invalidate?: (value?: Doc<T>) => void) {
		return this.store.subscribe(subscriber, invalidate);
	}

	toString() {
		const bytes = Automerge.save(this.get());
		return bytesToString(bytes);
	}

	fromString(str: string): Doc<T> {
		const bytes = stringToBytes(str);
		return Automerge.load<T>(bytes);
	}
}

export function bytesToString(bytes: BinaryDocument): string {
	return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}

export function stringToBytes(hexString: string): BinaryDocument {
	const result = [];
	for (let i = 0; i < hexString.length; i += 2) {
		result.push(parseInt(hexString.substr(i, 2), 16));
	}
	const array = new Uint8Array(result) as unknown as BinaryDocument;
	array.__binaryDocument = true;
	return array;
}
