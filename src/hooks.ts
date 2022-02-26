import cookie from 'cookie';
import { run } from '$lib/prisma';
import type { IJwtString } from '$lib/api/jwt';
import { decode } from '$lib/api/jwt';
import type { MaybePromise, RequestEvent } from '@sveltejs/kit/types/internal';

export function handle({
	event,
	resolve
}: {
	event: RequestEvent;
	resolve: (request: RequestEvent) => MaybePromise<Response>;
}) {
	const token = event.request.headers.has('cookie')
		? cookie.parse(event.request.headers.get('cookie')).token
		: 'undefined';

	if (token && token !== 'undefined') {
		event.locals.token = token as IJwtString<{ userId: string }>;
	}

	return resolve(event);
}

export function getSession(request: RequestEvent): MaybePromise<App.Session> {
	if (request.locals.token) {
		return decode<{ userId: string }>(request.locals.token)
			.then(({ userId }) =>
				run((client) =>
					client.user.findUnique({
						where: {
							id: userId
						},
						include: {
							emails: true
						}
					})
				)
			)
			.then((user) => ({ user }));
	} else {
		return null;
	}
}
