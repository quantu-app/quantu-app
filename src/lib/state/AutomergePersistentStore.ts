import { debounce } from '@aicacia/debounce';
import { forage } from '@tauri-apps/tauri-forage';
import Automerge, { FreezeObject } from 'automerge';
import eventemitter3 from 'eventemitter3';
import type { ChangeFn, Doc, BinaryDocument } from 'automerge';
import { get, Readable, Subscriber, writable, Writable } from 'svelte/store';

export interface AutomergePersistentStoreEvents<T> {
	persist: (doc: Doc<T>) => void;
}

export class AutomergePersistentStore<T>
	extends eventemitter3.EventEmitter<AutomergePersistentStoreEvents<T>>
	implements Readable<Doc<T>>
{
	protected name: string;
	protected store: Writable<Doc<T>>;
	protected initialized = false;
	protected updating = false;
	protected changeFns: ChangeFn<T>[] = [];
	protected debouncedPersist: () => void;

	constructor(name: string, initialState: Doc<T>, timeoutMS = 5000) {
		super();
		this.name = name;
		this.store = writable(initialState);
		this.init();
		this.debouncedPersist = debounce(this.persist, timeoutMS);
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
		changeFns.forEach((changeFn) => this.store.update((doc) => Automerge.change(doc, changeFn)));
		this.persist();

		this.initialized = true;
	}

	async close() {
		await this.persist();
		this.removeAllListeners();
		return this;
	}

	persist = async (force = false) => {
		if (this.updating || force) {
			this.updating = false;
			await forage.setItem({ key: this.name, value: this.toString() })();
			this.emit('persist', this.get());
		}
	};

	static async remove(key: string) {
		await forage.removeItem({ key })();
	}

	get() {
		return get(this.store);
	}
	set(doc: FreezeObject<T>) {
		this.store.set(doc);
		return this;
	}
	change(changeFn: ChangeFn<T>) {
		this.updating = true;
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
		return bytesToJSON(bytes);
	}

	fromString(str: string): Doc<T> {
		const bytes = jsonToBytes(str);
		return Automerge.load<T>(bytes);
	}
}

function bytesToJSON(bytes: BinaryDocument) {
	return JSON.stringify(Array.from(bytes));
}

function jsonToBytes(str: string): BinaryDocument {
	const array = Uint8Array.from(JSON.parse(str)) as unknown as BinaryDocument;
	array.__binaryDocument = true;
	return array;
}
