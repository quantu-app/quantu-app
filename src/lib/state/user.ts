import { AuthService, OpenAPI, User } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable, derived } from 'svelte/store';
import { isOnline, onlineEmitter } from './online';
import { LocalJSON } from './LocalJSON';
import { EventEmitter } from 'eventemitter3';

const usersLocal = new LocalJSON<User>('users'),
	usersWritable = writable<Record<string, User>>({});

export const users: Readable<Record<string, User>> = { subscribe: usersWritable.subscribe };
export const currentUser = derived(usersWritable, (users) =>
	Object.values(users).find((user) => user.token !== null)
);
export const userEmitter = new EventEmitter<{ signIn: () => void; signOut: () => void }>();

export function getCurrentUser(): User {
	return get(currentUser);
}

export function isSignedIn() {
	return !!getCurrentUser();
}

export async function signIn(username: string, password: string) {
	const user = await AuthService.quantuAppWebControllerAuthSignInSignIn({
		usernameOrEmail: username,
		password
	});
	await signInUser(user);
}

export async function signUp(username: string, password: string, passwordConfirmation: string) {
	const user = await AuthService.quantuAppWebControllerAuthSignUpSignUp({
		username,
		password,
		passwordConfirmation
	});
	await signInUser(user);
}

export async function signOut() {
	await AuthService.quantuAppWebControllerAuthDelete();
	await signOutUser();
}

export async function fetchCurrentUser() {
	const currentUser = getCurrentUser();

	if (currentUser && currentUser.token) {
		const headers = OpenAPI.HEADERS || (OpenAPI.HEADERS = {});
		headers['authorization'] = `Bearer ${currentUser.token}`;
		const user = await AuthService.quantuAppWebControllerAuthCurrent();
		signInUser(user);
	}
}

async function signInUser(user: User) {
	usersWritable.update((oldUsers) => {
		const users = Object.entries(oldUsers).reduce(
			(users, [id, user]) => ({
				...users,
				[id]: { ...user, token: null }
			}),
			{}
		);
		users[user.id] = user;
		return users;
	});
	await usersLocal.batch(Object.entries(get(usersWritable)));
	userEmitter.emit('signIn');
}

async function signOutUser() {
	const headers = OpenAPI.HEADERS || (OpenAPI.HEADERS = {});
	delete headers['authorization'];
	usersWritable.update((oldUsers) =>
		Object.entries(oldUsers).reduce(
			(users, [id, user]) => ({
				...users,
				[id]: { ...user, token: null }
			}),
			{}
		)
	);
	await usersLocal.batch(Object.entries(get(usersWritable)));
	userEmitter.emit('signOut');
}

if (typeof window === 'object') {
	usersLocal.all().then((localUsers) => {
		let userWithToken: User | null = null;
		usersWritable.update((state) =>
			Object.entries(localUsers).reduce((state, [id, user]) => {
				if (user.token) {
					userWithToken = user;
				}
				state[id] = user;
				return state;
			}, state)
		);
		if (userWithToken) {
			signInUser(userWithToken);
		}
	});

	onlineEmitter.on('online', fetchCurrentUser);

	if (isOnline()) {
		fetchCurrentUser();
	}
}
