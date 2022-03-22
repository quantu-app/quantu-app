import type { LoadOutput } from '@sveltejs/kit/types/private';

export function authGuard({ url, session }): LoadOutput {
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
}
