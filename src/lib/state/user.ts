import type { Readable, Writable } from 'svelte/store';
import { get, writable, derived } from 'svelte/store';
import EventEmitter from 'eventemitter3';
import Cookies from 'js-cookie';
import type { ApplicationSettings, User, Email } from '@prisma/client';
import { base } from '$app/paths';
import { goto } from '$app/navigation';
import {
	apiUserPath,
	apiUserSettingsPath,
	challengesPath,
	userWelcomePath
} from '$lib/routingUtils';
import { subYears } from 'date-fns';
import { DEFAULT_AGE } from '$lib/components/user/userProfileSuite';

export type PublicUser = User & {
	emailHash: string;
};

export type StateUser = PublicUser & {
	emails: Email[];
	settings: ApplicationSettings;
};

export const redirectPathWritable = writable<string | undefined>();
export const currentUserWritable: Writable<StateUser | null> = writable(null);
export const currentUser: Readable<StateUser | null> = derived(currentUserWritable, (user) => user);
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
	const res = await fetch(apiUserPath());
	if (!res.ok) {
		throw new Error('Failed to sign in');
	}
	const user = userFromJSON(await res.json());
	const redirectPath = get(redirectPathWritable);

	currentUserWritable.update((state) => ({ ...state, ...user }));
	if (user.confirmed) {
		if (redirectPath) {
			redirectPathWritable.set(undefined);
			window.location.href = redirectPath;
		} else {
			await goto(challengesPath());
		}
	} else {
		await goto(userWelcomePath());
	}
	userEmitter.emit('signIn', user);
}

export async function signOut() {
	await goto(`${base}/`);
	Cookies.remove('token');
	currentUserWritable.set(null);
	redirectPathWritable.set(undefined);
	userEmitter.emit('signOut');
}

export async function updateUser(data: Partial<User>) {
	const res = await fetch(apiUserPath(), {
		method: 'PATCH',
		body: JSON.stringify(data)
	});
	if (res.ok) {
		const user = userFromJSON(await res.json());
		currentUserWritable.update((state) => ({ ...state, ...user }));
		return user;
	} else {
		throw await res.json();
	}
}

export async function updateSettings(data: Partial<ApplicationSettings>) {
	const res = await fetch(apiUserSettingsPath(), {
		method: 'PATCH',
		body: JSON.stringify(data)
	});
	if (res.ok) {
		const settings = userFromJSON(await res.json());
		currentUserWritable.update((state) => (state ? { ...state, settings } : null));
		return settings;
	} else {
		throw await res.json();
	}
}

export function userFromJSON(user: any): StateUser {
	return {
		...user,
		birthday: user.birthday ? new Date(user.birthday) : subYears(new Date(), DEFAULT_AGE),
		updatedAt: new Date(user.updatedAt),
		createdAt: new Date(user.createdAt)
	};
}
