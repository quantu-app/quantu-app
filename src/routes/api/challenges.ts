import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';
import { removePrivate } from './departments/[departmentUrl]/challenges';

export const get = authenticated((event: RequestEvent) =>
	// left join challenges on results where user_id = currentUser.id (in mongodb)
	// Two queries, iterate over second.
	run((client) => {
		return client.challenge.findMany({
			where: {
				visible: true,

				NOT: [{ releasedAt: null }],

				releasedAt: {
					lte: new Date()
				},

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
			},
			orderBy: {
				releasedAt: 'desc'
			}
		});
	}).then((challenges) => ({
		body: challenges.map((c) => {
			(c as any).result = c.results[0];
			delete c.results;
			removePrivate(c);
			return c;
		}),
		status: 200
	}))
);
