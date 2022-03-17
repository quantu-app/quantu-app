import type { RequestEvent, RequestHandler } from '@sveltejs/kit/types/internal';

export interface ITokenValue {
	userId: string;
}

export const authenticated = (handler: RequestHandler) => (event: RequestEvent) =>
	event.locals.token && event.locals.token.userId
		? handler(event)
		: {
				status: 401
		  };
