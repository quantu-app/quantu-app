import cookie from 'cookie';
import { prerendering } from '$app/environment';
import { decode } from '$lib/api/jwt';
import type { IJwtString } from '$lib/api/jwt';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import type { ITokenValue } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { StateUser } from '$lib/state/user';

export const handle: Handle = async ({ event, resolve }) => {
	const rawToken = event.request.headers.has('cookie')
		? cookie.parse(event.request.headers.get('cookie') || '').token
		: 'undefined';

	if (rawToken && rawToken !== 'undefined') {
		event.locals.rawToken = rawToken as IJwtString<ITokenValue>;
	}
	if (event.locals.rawToken) {
		event.locals.token = await decode(event.locals.rawToken);
	}
	if (event.locals.token) {
		const userId = event.locals.token.userId + '';
		event.locals.user = await run(
			async (client) =>
				(await client.user.findUnique({
					where: {
						id: userId
					},
					select: {
						id: true,
						username: true,
						creator: true,
						active: true,
						emails: true,
						confirmed: true,
						firstName: true,
						lastName: true,
						birthday: true,
						country: true,
						bio: true,
						createdAt: true,
						updatedAt: true
					}
				})) as StateUser
		);
	}
	return resolve(event);
};

export const handleError: HandleServerError = (input) => {
	if (!prerendering) {
		console.error(
			input.event.getClientAddress(),
			input.event.url.pathname + input.event.url.search,
			input.error
		);
	}

	return {
		message: 'Internal Application Error',
		code: (input.error as any).code ?? 'UNKNOWN'
	};
};
