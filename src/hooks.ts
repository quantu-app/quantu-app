import cookie from 'cookie';
import { run } from '$lib/prisma';
import { dev, prerendering } from '$app/env';
import { decode } from '$lib/api/jwt';
import type { IJwtString } from '$lib/api/jwt';
import type { GetSession, Handle, HandleError } from '@sveltejs/kit';
import type { ITokenValue } from '$lib/api/auth';

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
	return resolve(event);
};

const onError: HandleError = ({ error, event }) => {
	if (!prerendering) {
		console.error(event.clientAddress, event.url.pathname + event.url.search, error);
	}
};

export const handleError = dev ? undefined : onError;

export const getSession: GetSession = (request) =>
	request.locals.token
		? run((client) =>
				client.user.findUnique({
					where: {
						id: request.locals.token?.userId
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
		  ).then((user) => ({ user }))
		: {};
