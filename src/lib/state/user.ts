import { AuthService, OpenAPI, User } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable, derived } from 'svelte/store';
import { isOnline, onlineEmitter } from './online';
import { LocalJSON } from './LocalJSON';
import EventEmitter from 'eventemitter3';
import type { Socket } from 'phoenix';
import { load } from './loading';
import cookie from 'js-cookie';

interface IUserState extends User {
	current: boolean;
}

interface IUsersState {
	[userId: string]: IUserState;
}

const usersLocal = new LocalJSON<IUserState>('users'),
	usersWritable = writable<IUsersState>({}),
	socketWritable = writable<Socket>();

export const users: Readable<IUsersState> = { subscribe: usersWritable.subscribe };
export const currentUser = derived(usersWritable, (users) =>
	Object.values(users).find((user) => user.current)
);
export const signedIn = derived(currentUser, (currentUser) => !!currentUser);

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
	const user = await load(
		AuthService.quantuAppWebControllerAuthSignInSignIn({
			usernameOrEmail: username,
			password
		})
	);
	await signInUser(user);
}

export async function signUp(username: string, password: string, passwordConfirmation: string) {
	const user = await load(
		AuthService.quantuAppWebControllerAuthSignUpSignUp({
			username,
			password,
			passwordConfirmation
		})
	);
	await signInUser(user);
}

export async function signOut() {
	await load(AuthService.quantuAppWebControllerAuthDelete());
	await signOutUser();
}

export async function fetchCurrentUser() {
	const currentUser = getCurrentUser();

	if (currentUser && currentUser.token) {
		await signInWithToken(currentUser.token);
	} else {
		await signOutUser();
	}
}

export async function signInWithToken(token: string) {
	try {
		OpenAPI.TOKEN = token;
		const user = await load(AuthService.quantuAppWebControllerAuthCurrent());
		await signInUser(user);
	} catch {
		await signOutUser();
	}
}

async function setUserSocket(token: string) {
	const { Socket } = await import('phoenix');
	const socket = new Socket(`${import.meta.env.VITE_WS_URL}/socket`, {
		params: { token }
	});
	socket.onOpen(() => socketWritable.set(socket));
	socket.connect();
}

async function signInUser(currentUser: User) {
	usersWritable.update((state) => {
		const users = Object.entries(state).reduce(
			(users, [id, user]) => ({
				...users,
				[id]: { ...user, current: false }
			}),
			state
		);
		users[currentUser.id] = { ...currentUser, current: true };
		return users;
	});
	await load(Promise.all(Object.values(get(users)).map((user) => usersLocal.set(user.id, user))));
	OpenAPI.TOKEN = currentUser.token;
	cookie.set('user', JSON.stringify({ id: currentUser.id, token: currentUser.token }));
	await setUserSocket(currentUser.token);
	userEmitter.emit('signIn', currentUser);
}

function removeUserSocket() {
	get(socketWritable)?.disconnect();
	socketWritable.set(null);
}

async function signOutUser() {
	OpenAPI.TOKEN = undefined;
	cookie.remove('user');
	usersWritable.update((state) =>
		Object.entries(state).reduce(
			(users, [id, user]) => ({
				...users,
				[id]: { ...user, current: false }
			}),
			state
		)
	);
	removeUserSocket();
	await load(Promise.all(Object.values(get(users)).map((user) => usersLocal.set(user.id, user))));
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
