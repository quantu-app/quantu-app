import { decode } from '$lib/api/jwt';
import { showPrivateUser } from '$lib/api/users/showPrivate';
import { updateUser } from '$lib/api/users/updateUser';
import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit';

export function get(event: RequestEvent) {
	return decode<{ userId: string }>(event.locals.token)
		.then(({ userId }) => run((client) => showPrivateUser(client, { userId })))
		.then((user) => {
			if (!user) {
				throw new Error('User not found');
			} else {
				return {
					status: 200,
					body: user
				};
			}
		})
		.catch((error) => ({
			status: 401,
			body: error
		}));
}

export async function patch(event: RequestEvent) {
	return event.request
		.json()
		.then((body) =>
			decode<{ userId: string }>(event.locals.token)
				.then(({ userId }) => run((client) => updateUser(client, { userId: userId, ...body })))
				.then((user) => ({
					body: user,
					status: 200
				}))
		)
		.catch((error) => ({
			status: 401,
			body: error
		}));
}
