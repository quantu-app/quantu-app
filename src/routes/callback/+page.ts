import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	return {
		token: input.url.searchParams.get('token') as string
	};
};
