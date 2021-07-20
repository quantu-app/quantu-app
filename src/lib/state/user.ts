import { AuthService, OpenAPI, User } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable, derived } from 'svelte/store';
import { isOnline, onlineEmitter } from './online';
import { LocalJSON } from './LocalJSON';
import EventEmitter from 'eventemitter3';
import * as Phoenix from 'phoenix';

const usersLocal = new LocalJSON<User>('users'),
	usersWritable = writable<Record<string, User>>({}),
	socketWritable = writable<Phoenix.Socket>();

export const users: Readable<Record<string, User>> = { subscribe: usersWritable.subscribe };
export const currentUser = derived(usersWritable, (users) =>
	Object.values(users).find((user) => user.token != null)
);
export const userEmitter = new EventEmitter<{
	signIn: (user: User) => void;
	signOut: () => void;
}>();

export function getSocket() {
	return get(socketWritable);
}

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

function setUserSocket(currentUser: User) {
	const socket = new Phoenix.Socket(`${import.meta.env.VITE_QUANTU_WS_URL}/socket`, {
		params: { token: currentUser.token }
	});
	socket.onOpen(() => socketWritable.set(socket));
	socket.connect();
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
	await Promise.all(Object.values(get(users)).map((user) => usersLocal.set(user.id, user)));
	setAuthToken(currentUser);
	setUserSocket(currentUser);
	userEmitter.emit('signIn', currentUser);
}

function removeUserSocket() {
	get(socketWritable)?.disconnect();
	socketWritable.set(null);
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
	removeUserSocket();
	await Promise.all(Object.values(get(users)).map((user) => usersLocal.set(user.id, user)));
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
