import { debounce } from '@aicacia/debounce';
import eventemitter3 from 'eventemitter3';
import { get, Subscriber, Updater, writable, Writable } from 'svelte/store';
import { getRemoteStorage } from './remoteStorage';

export interface RSStoreEvents<T> {
	persist: (state: T) => void;
}

export class RSStore<T>
	extends eventemitter3.EventEmitter<RSStoreEvents<T>>
	implements Writable<T>
{
	protected type: string;
	protected path: string;
	protected store: Writable<T>;
	protected initialized = false;
	protected saved = false;
	protected updateFns: Updater<T>[] = [];
	protected debouncedPersist: () => void;

	constructor(type: string, path: string, initialState: T, timeoutMS = 5000) {
		super();
		this.type = type;
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
			const data = (await remoteStorage.scope('/').getObject(this.path, false)) as T;

			if (data) {
				this.store.set(data);
			}
		} catch (error) {
			console.error(error);
		}

		const updateFns = [...this.updateFns];
		this.updateFns.length = 0;
		updateFns.forEach((updateFn) => this.store.update(updateFn));
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
		await remoteStorage.scope('/').storeObject(this.type, this.path, this.get() as any);
	};

	static async remove(path: string) {
		const remoteStorage = await getRemoteStorage();
		await remoteStorage.scope('/').remove(path);
	}

	get() {
		return get(this.store);
	}
	set(state: T) {
		return this.update(() => state);
	}
	update(updateFn: Updater<T>) {
		if (this.initialized) {
			this.store.update(updateFn);
			this.debouncedPersist();
		} else {
			this.updateFns.push(updateFn);
		}
		return this;
	}
	subscribe(subscriber: Subscriber<T>, invalidate?: (value?: T) => void) {
		return this.store.subscribe(subscriber, invalidate);
	}
}
