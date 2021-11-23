import ee3 from 'eventemitter3';

export class AbortSignal {
	eventEmitter = new ee3.EventEmitter();
	onabort = null;
	aborted = false;

	toString() {
		return '[object AbortSignal]';
	}
	get [Symbol.toStringTag]() {
		return 'AbortSignal';
	}
	removeEventListener(name, handler) {
		this.eventEmitter.removeListener(name, handler);
	}
	addEventListener(name, handler) {
		this.eventEmitter.on(name, handler);
	}
	dispatchEvent(type) {
		const event = { type, target: this };
		const handlerName = `on${type}`;

		if (typeof this[handlerName] === 'function') this[handlerName](event);

		this.eventEmitter.emit(type, event);
	}
}
export class AbortController {
	signal = new AbortSignal();

	abort() {
		if (this.signal.aborted) return;

		this.signal.aborted = true;
		this.signal.dispatchEvent('abort');
	}
	toString() {
		return '[object AbortController]';
	}
	get [Symbol.toStringTag]() {
		return 'AbortController';
	}
}

if (typeof global !== 'undefined' && !('AbortController' in global)) {
	(global as any).AbortController = AbortController;
}
if (typeof window !== 'undefined' && !('AbortController' in window)) {
	(window as any).AbortController = AbortController;
}
