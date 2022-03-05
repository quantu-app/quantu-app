import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';
import { removePrivate } from './departments/[departmentUrl]/challenges';

export async function get(_event: RequestEvent) {
	return run((client) =>
		client.challenge.findMany({
			include: {
				department: {
					select: {
						url: true,
						name: true
					}
				}
			}
		})
	).then((challenges) => ({
		body: challenges.map(removePrivate),
		status: 200
	}));
}
