import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';
import { removePrivate } from '.';

export async function get(event: RequestEvent) {
	const departmentUrl: string = event.params.departmentUrl;
	const url: string = event.params.url;

	return run(async (client) => {
		const department = await client.department.findFirst({
			where: {
				url: departmentUrl
			}
		});
		return client.challenge.findFirst({
			where: {
				departmentId: department.id,
				url,
				results: {
					every: {
						userId: event.locals.token.userId
					}
				}
			},
			include: {
				department: {
					select: {
						url: true,
						name: true
					}
				},
				results: true
			}
		});
	}).then((challenge) => {
		removePrivate(challenge);
		(challenge as any).result = challenge.results[0];
		delete challenge.results;
		return {
			body: challenge,
			status: challenge ? 200 : 404
		};
	});
}
