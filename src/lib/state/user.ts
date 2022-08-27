import type { Readable } from 'svelte/store';
import { get, writable, derived } from 'svelte/store';
import EventEmitter from 'eventemitter3';
import { session } from '$app/stores';
import Cookies from 'js-cookie';
import type { ApplicationSettings, User, Email } from '@prisma/client';
import { base } from '$app/paths';
import { goto } from '$app/navigation';

export type PublicUser = User & {
	emailHash: string;
};

export type StateUser = PublicUser & {
	emails: Email[];
	settings: ApplicationSettings;
};

export const redirectPathWritable = writable<string | undefined>();
export const currentUser: Readable<StateUser> = derived(session, (session) => session?.user);
export const signedIn = derived(currentUser, (currentUser) => !!currentUser);

export const userEmitter = new EventEmitter<{
	signIn: (user: StateUser) => void;
	signOut: () => void;
}>();

export function getCurrentUser(): StateUser | null {
	return get(currentUser);
}

export function isSignedIn() {
	return !!getCurrentUser();
}

export async function signIn() {
	const res = await fetch(`${base}/api/user`);
	if (!res.ok) {
		throw new Error('Failed to sign in');
	}
	const user = userFromJSON(await res.json());
	const redirectPath = get(redirectPathWritable);

	session.update((session) => ({ ...session, user }));
	if (user.confirmed) {
		if (redirectPath) {
			redirectPathWritable.set(undefined);
			goto(redirectPath);
		}
	} else {
		goto(`${base}/user/welcome`);
	}
	userEmitter.emit('signIn', user);
}

export function signOut() {
	Cookies.remove('token');
	session.set(null);
	userEmitter.emit('signOut');
}

export async function updateUser(data: Partial<User>) {
	const res = await fetch(`${base}/api/user`, {
		method: 'PATCH',
		body: JSON.stringify(data)
	});
	if (res.ok) {
		const user = userFromJSON(await res.json());
		session.update((session) => ({ ...session, user }));
		return user;
	} else {
		throw await res.json();
	}
}

export async function updateSettings(data: Partial<ApplicationSettings>) {
	const res = await fetch(`${base}/api/user/settings`, {
		method: 'PATCH',
		body: JSON.stringify(data)
	});
	if (res.ok) {
		const settings = userFromJSON(await res.json());
		session.update((session) => ({ ...session, user: { ...session.user, settings } }));
		return settings;
	} else {
		throw await res.json();
	}
}

export function userFromJSON(user: any): StateUser {
	return {
		...user,
		birthday: user.birthday ? new Date(user.birthday) : new Date(Date.now() - 1000000000000), // TODO: use correct birthdate
		updatedAt: new Date(user.updatedAt),
		createdAt: new Date(user.createdAt)
	};
}
