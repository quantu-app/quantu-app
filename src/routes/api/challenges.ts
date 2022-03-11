import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';
import { removePrivate } from './departments/[departmentUrl]/challenges';

export async function get(_event: RequestEvent) {
	// left join challenges on results where user_id = currentUser.id (in mongodb)
	// Two queries, iterate over second.
	return run((client) => {
		return client.challenge.findMany({

			where: {

				visible: true,

				NOT: [
					{ releasedAt: null }
				],

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
				},
				results: {
					select: {
						id: true,
					}
				}
			},
			orderBy: {
				releasedAt: 'desc'
			}
		});


	}).then((challenges) => ({
		body: challenges.map(removePrivate),
		status: 200
	}));
}
