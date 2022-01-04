import EventEmitter from 'eventemitter3';
import type { Readable } from 'svelte/store';
import { get, writable, derived } from 'svelte/store';
import { addNotification, NotificationType } from './notifications';

const { update, subscribe } = writable(0);

export const loadingEmitter = new EventEmitter<{ start: () => void; end: () => void }>();

export const tasks: Readable<number> = { subscribe };
export const loading = derived(tasks, (count) => count > 0);

export function isLoading() {
	return get(loading);
}

export function load<T>(promise: Promise<T>): Promise<T> {
	update((count) => count + 1);
	loadingEmitter.emit('start');
	return promise
		.catch((error) => {
			if (error && error.body && error.body.errors) {
				if (Array.isArray(error.body.errors)) {
					error.body.errors.forEach(
						(message: { detail: string; source: { pointer: string }; title: string }) => {
							addNotification({
								type: NotificationType.Danger,
								heading: `${message.source.pointer} ${message.title}`,
								description: message.detail
							});
						}
					);
				} else {
					Object.entries(error.body.errors).forEach(([name, message]: [string, string[]]) => {
						addNotification({
							type: NotificationType.Danger,
							heading: name,
							description: message && message.join ? message.join(', ') : message + ''
						});
					});
				}
			}
			return Promise.reject(error);
		})
		.finally(() => {
			update((count) => count - 1);
			loadingEmitter.emit('end');
		});
}
