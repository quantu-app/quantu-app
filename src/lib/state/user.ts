import type { User } from '$lib/api/quantu-app-api';
import { AuthService, OpenAPI } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable, derived } from 'svelte/store';
import EventEmitter from 'eventemitter3';
import type { Socket } from 'phoenix';
import { load } from './loading';
import { session } from '$app/stores';
import Cookies from 'js-cookie';
import { goto } from '$app/navigation';
import { WS_URL } from '$lib/constants';

const socketWritable = writable<Socket>();
export const redirectPathWritable = writable<string>();
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
	try {
		await load(AuthService.quantuAppWebControllerAuthDelete());
	} finally {
		signOutUser();
	}
}

export async function signInWithToken(token: string) {
	try {
		OpenAPI.TOKEN = token;
		const user = await load(AuthService.quantuAppWebControllerAuthCurrent());
		await signInUser(user);
	} catch {
		signOutUser();
	}
}

async function signInUser(currentUser: User) {
	const redirectPath = get(redirectPathWritable),
		tasks: Promise<unknown>[] = [];

	OpenAPI.TOKEN = currentUser.token;
	Cookies.set('token', currentUser.token, { expires: 30 });
	session.set(currentUser);
	if (redirectPath) {
		redirectPathWritable.set(undefined);
		tasks.push(goto(redirectPath));
	}
	tasks.push(setUserSocket(currentUser.token));
	userEmitter.emit('signIn', currentUser);
	await Promise.all(tasks);
}

async function setUserSocket(token: string) {
	const { Socket } = await import('phoenix');
	const socket = new Socket(`${WS_URL}/socket`, {
		params: { token }
	});
	socket.onOpen(() => socketWritable.set(socket));
	socket.connect();
}

function signOutUser() {
	OpenAPI.TOKEN = undefined;
	Cookies.remove('token');
	session.set(null);
	get(socketWritable)?.disconnect();
	socketWritable.set(null);
	userEmitter.emit('signOut');
}
