import { debounce } from '@aicacia/debounce';
import Automerge, { BinaryDocument } from 'automerge';
import eventemitter3 from 'eventemitter3';
import type { ChangeFn, Doc } from 'automerge';
import { get, Readable, Subscriber, writable, Writable } from 'svelte/store';
import { getRemoteStorage } from './remoteStorage';

export interface AutomergeRSStoreEvents<T> {
	persist: (doc: Doc<T>) => void;
}

export class AutomergeRSStore<T>
	extends eventemitter3.EventEmitter<AutomergeRSStoreEvents<T>>
	implements Readable<Doc<T>>
{
	protected path: string;
	protected store: Writable<Doc<T>>;
	protected initialized = false;
	protected saved = false;
	protected changeFns: ChangeFn<T>[] = [];
	protected debouncedPersist: () => void;

	constructor(path: string, initialState: Doc<T>, timeoutMS = 5000) {
		super();
		this.path = path;
		this.store = writable(initialState);
		this.init();
		this.debouncedPersist = debounce(this.persist, timeoutMS, {
			after: () => (this.saved = true),
			before: () => (this.saved = false)
		});
	}

	private async init() {
		try {
			const remoteStorage = await getRemoteStorage();
			const { data } = (await remoteStorage.scope('/').getFile(this.path, false)) as { data: T };
			if (data) {
				const binaryDocument = new Uint8Array(Object.values(data)) as unknown as BinaryDocument;
				binaryDocument.__binaryDocument = true;
				this.store.set(Automerge.load<T>(binaryDocument));
			}
		} catch (error) {
			console.error(error);
		}

		const changeFns = [...this.changeFns];
		this.changeFns.length = 0;
		changeFns.forEach((changeFn) => this.store.update((doc) => Automerge.change(doc, changeFn)));
		await this.persist();

		this.initialized = true;
	}

	async close() {
		await this.persist();
		this.removeAllListeners();
		return this;
	}

	persist = async () => {
		this.emit('persist', this.get());
		const remoteStorage = await getRemoteStorage();
		await remoteStorage
			.scope('/')
			.storeFile('application/octet-stream ', this.path, Automerge.save(this.get()));
	};

	static async remove(path: string) {
		const remoteStorage = await getRemoteStorage();
		await remoteStorage.scope('/').remove(path);
	}

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
}
