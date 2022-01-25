import type { UserPrivate } from './lib/api/quantu-app-api';
import { AuthService, OpenAPI } from './lib/api/quantu-app-api';
import type { MaybePromise } from '@sveltejs/kit/types/helper';
import type { RequestEvent } from '@sveltejs/kit/types/hooks';
import cookie from 'cookie';
import '$lib/AbortController';

export interface Locals {
	token?: string;
}

export function handle({
	event,
	resolve
}: {
	event: RequestEvent<Locals>;
	resolve: (request: RequestEvent<Locals>) => MaybePromise<Response>;
}) {
	const token = event.request.headers.has('cookie')
		? cookie.parse(event.request.headers.get('cookie')).token
		: 'undefined';

	if (token && token !== 'undefined') {
		event.locals.token = token;
	}

	return resolve(event);
}

export function getSession(request: RequestEvent<Locals>): MaybePromise<UserPrivate | null> {
	if (request.locals.token) {
		OpenAPI.TOKEN = request.locals.token;
		return AuthService.quantuAppWebControllerAuthCurrent().catch((error) => {
			console.error(error);
			request.locals.token = undefined;
			OpenAPI.TOKEN = undefined;
			return null;
		});
	} else {
		return null;
	}
}
