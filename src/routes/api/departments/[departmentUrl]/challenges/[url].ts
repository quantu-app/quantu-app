import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';
import { removePrivate } from '.';

export async function get(event: RequestEvent) {
	const departmentUrl: string = event.params.departmentUrl;
	const url: string = event.params.url;

	return run((client) =>
		client.challenge
			.findFirst({
				where: {
					url,
					department: {
						url: departmentUrl
					}
				},
				include: {
					department: {
						select: {
							url: true,
							name: true
						}
					}
				}
			})
			.then((challenge) =>
				client.result
					.findFirst({
						where: {
							userId: event.locals.token.userId,
							challengeId: challenge.id
						}
					})
					.then((result) => {
						(challenge as any).result = result;
						return challenge;
					})
			)
	).then((challenge) => ({
		body: removePrivate(challenge),
		status: challenge ? 200 : 404
	}));
}
