import type { Readable } from 'svelte/store';
import { get, writable, derived } from 'svelte/store';
import EventEmitter from 'eventemitter3';
import { session } from '$app/stores';
import Cookies from 'js-cookie';
import type { User } from '@prisma/client';
import { base } from '$app/paths';
import { goto } from '$app/navigation';

export const redirectPathWritable = writable<string>();
export const currentUser: Readable<User> = derived(session, (session) => session?.user);
export const signedIn = derived(currentUser, (currentUser) => !!currentUser);

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

export async function signIn() {
	const res = await fetch(`${base}/api/user`);
	const json = await res.json();
	if (!res.ok) {
		throw new Error('Failed to sign in');
	}
	const redirectPath = get(redirectPathWritable);

	session.update((session) => ({ ...session, user: json }));
	if (json.confirmed) {
		if (redirectPath) {
			redirectPathWritable.set(undefined);
			goto(redirectPath);
		}
	} else {
		goto(`${base}/user/welcome`);
	}
	userEmitter.emit('signIn', json);
}

export function signOut() {
	Cookies.remove('token');
	session.set(null);
	userEmitter.emit('signOut');
}

export async function updateUser(updateUser: Partial<User>) {
	const res = await fetch(`${base}/api/user`, {
		method: 'PATCH',
		body: JSON.stringify(updateUser)
	});
	const body = await res.json();
	if (res.ok) {
		session.update((session) => ({ ...session, user: body }));
		return body;
	} else {
		throw body;
	}
}
