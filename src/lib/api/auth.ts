import { run } from '$lib/prisma';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit/types/internal';

export interface ITokenValue {
	userId: string;
}

export const authenticated = (handler: RequestHandler) => (event: RequestEvent) =>
	event.locals.token && event.locals.token?.userId
		? handler(event)
		: {
				status: 401
		  };

export const isCreator = (handler: RequestHandler) =>
	authenticated((event) =>
		run((client) =>
			client.user
				.findUnique({
					where: {
						id: event.locals.token?.userId
					}
				})
				.then((user) =>
					user?.creator
						? handler(event)
						: {
								status: 403
						  }
				)
		)
	);
