import { providers } from '$lib/oauth2';
import type { RequestEvent } from '@sveltejs/kit';

export async function get(event: RequestEvent) {
	const url = new URL(event.request.url);
	const provider = providers[event.params.provider];
	return {
		headers: {
			Location: await provider.signin(url, { isCreate: true })
		},
		status: 302
	};
}
