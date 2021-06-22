import type { UUID } from 'automerge';
import Automerge from 'automerge';
import { writable } from 'svelte/store';

export enum NotificationType {
	Primary = 'primary',
	Secondary = 'secondary',
	Success = 'success',
	Danger = 'danger',
	Warning = 'warning',
	Info = 'info',
	Light = 'light',
	Dark = 'dark'
}

export interface INotificationOptions {
	type?: NotificationType;
	heading?: string;
	description: string;
	timeout?: number;
}

export interface INotification {
	id: UUID;
	type: NotificationType;
	heading?: string;
	description: string;
}

function createNotification(options: INotificationOptions) {
	return {
		id: Automerge.uuid(),
		type: options.type || NotificationType.Primary,
		heading: options.heading,
		description: options.description
	};
}

function createStore() {
	const { update, subscribe } = writable<INotification[]>([]);

	const notifications = { subscribe };

	function addNotification(options: INotificationOptions) {
		const timeout =
				typeof options.timeout === 'number' && options.timeout > 0 ? options.timeout : 5000,
			notification = createNotification(options);

		update((state) => [...state, notification]);
		setTimeout(() => removeNotification(notification.id), timeout);
	}

	function removeNotification(id: UUID) {
		update((state) => {
			const index = state.findIndex((notification) => notification.id === id);

			if (index === -1) {
				return state;
			} else {
				const newState = [...state];
				newState.splice(index, 1);
				return newState;
			}
		});
	}

	return {
		notifications,
		addNotification,
		removeNotification
	};
}

export const { notifications, addNotification, removeNotification } = createStore();
