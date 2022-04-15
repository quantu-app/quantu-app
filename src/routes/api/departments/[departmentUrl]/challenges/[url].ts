import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';
import { removePrivate } from '.';

export async function get(event: RequestEvent) {
	const departmentUrl = event.params.departmentUrl;
	const url = event.params.url;

	return run(async (client) => {
		const challenge = await client.challenge.findFirst({
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
		});

		if (challenge) {
			const [result, solvers] = await Promise.all([
				client.result.findUnique({
					where: {
						userId_challengeId: {
							userId: event.locals.token.userId,
							challengeId: challenge.id
						}
					}
				}),
				client.result.aggregate({
					_count: { _all: true },
					where: {
						challengeId: challenge.id
					}
				})
			]);
			(challenge as any).result = result;
			(challenge as any).solvers = solvers || 0;
		}

		return {
			body: removePrivate(challenge),
			status: challenge ? 200 : 404
		};
	});
}
