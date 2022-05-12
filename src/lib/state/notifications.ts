import { v4 } from 'uuid';
import { derived, writable } from 'svelte/store';

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

const notificationWritable = writable<INotification[]>([]);

export const notifications = derived(notificationWritable, (notifications) => notifications);

function createNotification(options: INotificationOptions) {
	return {
		id: v4(),
		type: options.type || NotificationType.Primary,
		heading: options.heading,
		description: options.description
	};
}

export function addNotification(options: INotificationOptions) {
	const timeout =
			typeof options.timeout === 'number' && options.timeout > 0 ? options.timeout : 5000,
		notification = createNotification(options);

	notificationWritable.update((state) => [...state, notification]);
	setTimeout(() => removeNotification(notification.id), timeout);
}

export function removeNotification(id: string) {
	notificationWritable.update((state) => {
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
