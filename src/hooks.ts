import type { User } from './lib/api/quantu-app-api';
import type { MaybePromise } from '@sveltejs/kit/types/helper';
import type { ServerRequest, ServerResponse } from '@sveltejs/kit/types/hooks';
import cookie from 'cookie';

export interface Locals {
	user?: User;
}

export async function handle({
	request,
	resolve
}: {
	request: ServerRequest<Locals>;
	resolve: (request: ServerRequest<Locals>) => MaybePromise<ServerResponse>;
}) {
	const { token } = request.headers.cookie
		? cookie.parse(request.headers.cookie)
		: { token: undefined };

	if (token) {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
			headers: {
				authorization: `Bearer ${token}`
			}
		});
		request.locals.user = await response.json();
	}

	return await resolve(request);
}

export function getSession(request: ServerRequest<Locals>): MaybePromise<User> {
	return request.locals.user;
}
