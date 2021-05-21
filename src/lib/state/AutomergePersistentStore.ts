import { debounce } from '@aicacia/debounce';
import { forage } from '@tauri-apps/tauri-forage';
import { load, save, FreezeObject, BinaryDocument, change, ChangeFn } from 'automerge';
import { get, Readable, Subscriber, writable, Writable } from 'svelte/store';

export class AutomergePersistentStore<T> implements Readable<FreezeObject<T>> {
	protected name: string;
	protected store: Writable<FreezeObject<T>>;
	protected initialized = false;
	protected changeFns: ChangeFn<T>[] = [];
	protected debouncedPersist: () => void;

	constructor(name: string, initialState: FreezeObject<T>, timeoutMS = 5000) {
		this.name = name;
		this.store = writable(initialState);
		this.init();
		this.debouncedPersist = debounce(this.persist, timeoutMS);
	}

	private async init() {
		const raw: string = await forage.getItem({ key: this.name })();

		if (raw) {
			this.store.set(this.fromString(raw));
		}

		const changeFns = this.changeFns.slice();
		this.changeFns.length = 0;
		changeFns.forEach((changeFn) => this.store.update((doc) => change(doc, changeFn)));
		this.debouncedPersist();

		this.initialized = true;
	}

	protected async persist() {
		await forage.setItem({ key: this.name, value: this.toString() })();
	}

	get() {
		return get(this.store);
	}
	change(changeFn: ChangeFn<T>) {
		if (this.initialized) {
			this.store.update((doc) => change(doc, changeFn));
			this.debouncedPersist();
		} else {
			this.changeFns.push(changeFn);
		}
		return this;
	}
	subscribe(
		subscriber: Subscriber<FreezeObject<T>>,
		invalidate?: (value?: FreezeObject<T>) => void
	) {
		return this.store.subscribe(subscriber, invalidate);
	}

	toString() {
		const bytes = save(this.get());
		return bytesToString(bytes);
	}

	fromString(str: string): FreezeObject<T> {
		const bytes = stringToBytes(str);
		return load<T>(bytes);
	}
}

export function bytesToString(bytes: BinaryDocument): string {
	return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}

export function stringToBytes(hexString: string): BinaryDocument {
	const array = new Uint8Array(
		hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
	) as unknown as BinaryDocument;
	array.__binaryDocument = true;
	return array;
}
