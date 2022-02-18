import type { MaybePromise } from '@sveltejs/kit/types/helper';
import type { RequestEvent } from '@sveltejs/kit/types/hooks';
import cookie from 'cookie';
import '$lib/AbortController';
import { run } from '$lib/prisma';
import type { IJwtString } from '$lib/api/jwt';
import { decode } from '$lib/api/jwt';
import { showPrivateUser } from '$lib/api/users/showPrivate';

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
			.then((token) => run((client) => showPrivateUser(client, { userId: token.userId })))
			.then((user) => ({ user }));
	} else {
		return null;
	}
}
