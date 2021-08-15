import { OpenAPI, User } from '$lib/api/quantu-app-api';
import type { LoadInput, LoadOutput } from '@sveltejs/kit';
import type { Rec } from '@sveltejs/kit/types/helper';

export async function authGuard({ session }: LoadInput<Rec, Rec, User>): Promise<LoadOutput> {
	if (session) {
		OpenAPI.TOKEN = session.token;
		return {};
	} else {
		return { status: 302, redirect: '/' };
	}
}