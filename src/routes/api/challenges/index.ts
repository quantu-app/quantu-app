import type { RequestEvent } from '@sveltejs/kit';
import { run } from '$lib/prisma';

export async function get(event: RequestEvent) {
	const topicId = event.url.searchParams.get('topicId');

	return run((client) =>
		client.challenge.findMany({
			where: {
				topicId
			},
			include: {
				topic: true
			}
		})
	).then((challenges) => ({
		body: challenges,
		status: 200
	}));
}
