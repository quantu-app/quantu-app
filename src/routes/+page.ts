import type { PageLoad } from './$types';

export const load: PageLoad = (input) => {
	const redirectPath = input.url.searchParams.get('redirectPath');

	return {
		redirectPath
	};
};
