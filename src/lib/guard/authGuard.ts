import type { UserPrivate } from '$lib/api/quantu-app-api';
import { OpenAPI } from '$lib/api/quantu-app-api';
import type { LoadInput, LoadOutput } from '@sveltejs/kit';
import type { Rec } from '@sveltejs/kit/types/helper';

export function authGuard({ page, session }: LoadInput<Rec, Rec, UserPrivate>): LoadOutput {
	if (session) {
		OpenAPI.TOKEN = session.token;
		return {};
	} else {
		const output = {
				status: 302,
				redirect: '/'
			},
			redirectQuery = page.query.toString(),
			redirectPath = page.path + (redirectQuery ? '?' + redirectQuery : '');

		if (redirectPath && page.path !== '/') {
			output.redirect += `?redirectPath=${encodeURIComponent(redirectPath)}`;
		}

		return output;
	}
}
