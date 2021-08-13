import { AuthService, OpenAPI, User } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable, derived } from 'svelte/store';
import { onlineEmitter } from './online';
import EventEmitter from 'eventemitter3';
import type { Socket } from 'phoenix';
import { load } from './loading';
import cookie from 'js-cookie';
import { session } from '$app/stores';
import { browser } from '$app/env';

const socketWritable = writable<Socket>();

export const currentUser: Readable<User> = derived(session, (user) => user);
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

async function signInUser(currentUser: User) {
	OpenAPI.TOKEN = currentUser.token;
	cookie.set('token', currentUser.token);

	session.set(currentUser);
	await fetch('/session', {
		method: 'POST',
		body: JSON.stringify(currentUser)
	});

	await setUserSocket(currentUser.token);

	userEmitter.emit('signIn', currentUser);
}

async function setUserSocket(token: string) {
	const { Socket } = await import('phoenix');
	const socket = new Socket(`${import.meta.env.VITE_WS_URL}/socket`, {
		params: { token }
	});
	socket.onOpen(() => socketWritable.set(socket));
	socket.connect();
}

async function signOutUser() {
	OpenAPI.TOKEN = undefined;
	cookie.remove('token');

	await fetch('/session', {
		method: 'DELETE'
	});
	session.set(null);

	get(socketWritable)?.disconnect();
	socketWritable.set(null);

	userEmitter.emit('signOut');
}

if (browser) {
	onlineEmitter.on('online', fetchCurrentUser);
}
