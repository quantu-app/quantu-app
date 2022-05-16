import cookie from 'cookie';
import { run } from '$lib/prisma';
import { decode } from '$lib/api/jwt';
import type { IJwtString } from '$lib/api/jwt';
import type { MaybePromise, RequestEvent } from '@sveltejs/kit/types/internal';
import type { ITokenValue } from '$lib/api/auth';

export async function handle({
	event,
	resolve
}: {
	event: RequestEvent;
	resolve: (request: RequestEvent) => MaybePromise<Response>;
}) {
	const rawToken = event.request.headers.has('cookie')
		? cookie.parse(event.request.headers.get('cookie')).token
		: 'undefined';

	if (rawToken && rawToken !== 'undefined') {
		event.locals.rawToken = rawToken as IJwtString<ITokenValue>;
	}
	if (event.locals.rawToken) {
		event.locals.token = await decode(event.locals.rawToken);
	}

	return resolve(event);
}

export function getSession(request: RequestEvent): MaybePromise<App.Session> {
	if (request.locals.token) {
		return run((client) =>
			client.user.findUnique({
				where: {
					id: request.locals.token.userId
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
			})
		).then((user) => ({ user }));
	} else {
		return null;
	}
}
