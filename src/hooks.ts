import { AuthService, OpenAPI, User } from './lib/api/quantu-app-api';
import type { MaybePromise } from '@sveltejs/kit/types/helper';
import type { ServerRequest, ServerResponse } from '@sveltejs/kit/types/hooks';
import cookie from 'cookie';

export interface Locals {
	token?: string;
}

export async function handle({
	request,
	resolve
}: {
	request: ServerRequest<Locals>;
	resolve: (request: ServerRequest<Locals>) => MaybePromise<ServerResponse>;
}) {
	const token = request.headers.cookie ? cookie.parse(request.headers.cookie).token : 'undefined';

	if (token && token !== 'undefined') {
		request.locals.token = token;
	}

	return await resolve(request);
}

export function getSession(request: ServerRequest<Locals>): MaybePromise<User | null> {
	if (request.locals.token) {
		OpenAPI.TOKEN = request.locals.token;
		return AuthService.quantuAppWebControllerAuthCurrent();
	} else {
		return null;
	}
}
