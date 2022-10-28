import { run } from '$lib/prisma';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';

export interface ITokenValue {
	userId: string;
}

export const authenticated = (handler: RequestHandler) => (event: RequestEvent) => {
	if (event.locals.user) {
		return handler(event);
	} else {
		return new Response(null, { status: 401 });
	}
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
				.then((user) => {
					if (user?.creator) {
						return handler(event);
					} else {
						return new Response(null, { status: 403 });
					}
				})
		)
	);
