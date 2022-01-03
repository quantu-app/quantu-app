import type { UserPrivate } from '$lib/api/quantu-app-api';
import { OpenAPI } from '$lib/api/quantu-app-api';
import type { LoadInput, LoadOutput } from '@sveltejs/kit';
import type { Rec } from '@sveltejs/kit/types/helper';

export function authGuard({ url, session }: LoadInput<Rec, Rec, UserPrivate>): LoadOutput {
	if (session) {
		OpenAPI.TOKEN = session.token;
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
