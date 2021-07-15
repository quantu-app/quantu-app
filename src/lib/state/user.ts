import { AuthService, User_Private } from '$lib/api/quantu-app-api';
import { Readable, get, writable } from 'svelte/store';

const { set, subscribe } = writable(null);

export const user: Readable<User_Private | null> = { subscribe };

export function getUser(): User_Private | null {
	return get(user);
}

export function isSignedIn() {
	return !!getUser();
}

export async function signIn(username: string, password: string) {
	const user = await AuthService.quantuAppWebControllerAuthSignInSignIn({
		usernameOrEmail: username,
		password
	});
	set(user);
}

export async function signUp(username: string, password: string, passwordConfirmation: string) {
	const user = await AuthService.quantuAppWebControllerAuthSignUpSignUp({
		username,
		password,
		passwordConfirmation
	});
	set(user);
}

export async function signOut() {
	await AuthService.quantuAppWebControllerAuthDelete();
	set(null);
}
