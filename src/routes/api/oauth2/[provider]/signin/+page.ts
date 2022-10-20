import { providers } from '$lib/oauth2';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	const provider = providers[input.params.provider];
	throw redirect(302, await provider.signin(input.url));
};
