import { decode } from '$lib/api/jwt';
import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export function get(event: RequestEvent) {
	return decode<{ userId: string }>(event.locals.token)
		.then(({ userId }) =>
			run((client) =>
				client.user.findUnique({
					where: {
						id: userId
					},
					include: {
						emails: true
					}
				})
			)
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
		});
}

export async function patch(event: RequestEvent) {
	return event.request.json().then((data) =>
		decode<{ userId: string }>(event.locals.token)
			.then(({ userId }) =>
				run((client) =>
					client.user.update({
						data,
						where: {
							id: userId
						},
						include: {
							emails: true
						}
					})
				)
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
	);
}
