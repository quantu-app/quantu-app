import type { Load } from '@sveltejs/kit';

export const authGuard: Load = ({ url, session }) => {
	if (session?.user) {
		return {};
	} else {
		const output = {
				status: 302,
				redirect: '/'
			},
			redirectQuery = url.searchParams.toString(),
			redirectPath = url.pathname + (redirectQuery ? '?' + redirectQuery : '');

		if (redirectPath && url.pathname !== '/') {
			output.redirect += `?redirectPath=${encodeURIComponent(redirectPath)}`;
		}

		return output;
	}
};
