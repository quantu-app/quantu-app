import { base } from '$app/paths';
import { userFromJSON } from '$lib/state/user';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	const username = input.params.username;
	const res = await input.fetch(`${base}/api/user/${username}`);
	if (!res.ok) {
		throw error(404);
	}
	const user = userFromJSON(await res.json());

	return {
		user,
		username: input.params.username
	};
};
