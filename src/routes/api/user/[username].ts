import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit';

export function get(event: RequestEvent) {
	const username = event.params.username;

	return run((client) => client.user.findUnique({ where: { username } }))
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
