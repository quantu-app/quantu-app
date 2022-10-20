import { providers } from '$lib/oauth2';
import { redirect, type RequestEvent } from '@sveltejs/kit';

export const load = async (event: RequestEvent) => {
	const url = new URL(event.request.url);
	const provider = providers[event.params.provider as string];
	throw redirect(302, await provider.signin(url));
};
