import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';
import { removePrivate } from './departments/[departmentUrl]/challenges';

export const get = authenticated((event: RequestEvent) =>
	run((client) =>
		client.challenge
			.findMany({
				where: {
					visible: true,

					NOT: [{ releasedAt: null }],

					releasedAt: {
						lte: new Date()
					}
				},
				include: {
					department: {
						select: {
							url: true,
							name: true
						}
					}
				},
				orderBy: {
					releasedAt: 'desc'
				}
			})
			.then((challenges) =>
				client.result
					.findMany({
						where: {
							userId: event.locals.token.userId,
							challengeId: {
								in: challenges.map((challenge) => challenge.id)
							}
						}
					})
					.then((results) => {
						const resultMap = results.reduce((map, result) => {
							map[result.challengeId] = result;
							return map;
						}, {});
						return challenges.map((challenge) => {
							(challenge as any).result = resultMap[challenge.id];
							return challenge;
						});
					})
			)
	).then((challenges) => ({
		body: challenges.map(removePrivate),
		status: 200
	}))
);
