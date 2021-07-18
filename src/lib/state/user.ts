import { AuthService, OpenAPI, User } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable, derived } from 'svelte/store';
import { isOnline, onlineEmitter } from './online';
import { LocalJSON } from './LocalJSON';
import EventEmitter from 'eventemitter3';

const usersLocal = new LocalJSON<User>('users'),
	usersWritable = writable<Record<string, User>>({});

export const users: Readable<Record<string, User>> = { subscribe: usersWritable.subscribe };
export const currentUser = derived(usersWritable, (users) =>
	Object.values(users).find((user) => user.token != null)
);
export const userEmitter = new EventEmitter<{
	signIn: (user: User) => void;
	signOut: () => void;
}>();

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
		try {
			setAuthToken(currentUser);
			const user = await AuthService.quantuAppWebControllerAuthCurrent();
			await signInUser(user);
		} catch {
			await signOutUser();
		}
	} else {
		await signOutUser();
	}
}

function setAuthToken(currentUser: User) {
	const headers = OpenAPI.HEADERS || (OpenAPI.HEADERS = {});
	headers['authorization'] = `Bearer ${currentUser.token}`;
}

async function signInUser(currentUser: User) {
	usersWritable.update((state) => {
		const users = Object.entries(state).reduce(
			(users, [id, user]) => ({
				...users,
				[id]: { ...user, token: null }
			}),
			state
		);
		users[currentUser.id] = currentUser;
		return users;
	});
	await usersLocal.batch(Object.entries(get(users)));
	setAuthToken(currentUser);
	userEmitter.emit('signIn', currentUser);
}

async function signOutUser() {
	const headers = OpenAPI.HEADERS || (OpenAPI.HEADERS = {});
	delete headers['authorization'];
	usersWritable.update((state) =>
		Object.entries(state).reduce(
			(users, [id, user]) => ({
				...users,
				[id]: { ...user, token: null }
			}),
			state
		)
	);
	await usersLocal.batch(Object.entries(get(users)));
	userEmitter.emit('signOut');
}

if (typeof window === 'object') {
	usersLocal.all().then((localUsers) => {
		usersWritable.update((state) =>
			Object.entries(localUsers).reduce(
				(state, [id, localUser]) => ({
					...state,
					[id]: localUser
				}),
				state
			)
		);
		if (isOnline()) {
			fetchCurrentUser();
		}
	});

	onlineEmitter.on('online', fetchCurrentUser);
}
