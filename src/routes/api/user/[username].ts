import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export function get(event: RequestEvent) {
	const username = event.params.username;

	return run((client) =>
		client.user.findUnique({ where: { username }, select: { username: true } })
	)
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
