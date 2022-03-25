import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';
import { removePrivate } from '.';

export async function get(event: RequestEvent) {
	const departmentUrl: string = event.params.departmentUrl;
	const url: string = event.params.url;

	return run(async (client) =>
		client.challenge
			.findFirst({
				where: {
					url,
					departmentId: (
						await client.department.findUnique({
							where: { url: departmentUrl },
							select: { id: true }
						})
					).id
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
				challenge
					? Promise.all([
							client.result.findFirst({
								where: {
									userId: event.locals.token.userId,
									challengeId: challenge.id
								}
							}),
							client.result.aggregate({
								_count: { _all: true },
								where: {
									challengeId: challenge.id
								}
							})
					  ]).then(([result, solvers]) => {
							(challenge as any).result = result;
							(challenge as any).solvers = solvers || 0;
							return challenge;
					  })
					: challenge
			)
	).then((challenge) => ({
		body: removePrivate(challenge),
		status: challenge ? 200 : 404
	}));
}
