import { v4 } from 'uuid';
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
	id: string;
	type: NotificationType;
	heading?: string;
	description: string;
}

function createNotification(options: INotificationOptions) {
	return {
		id: v4(),
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

	function removeNotification(id: string) {
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
