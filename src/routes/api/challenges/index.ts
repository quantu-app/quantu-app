import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export async function get(event: RequestEvent) {
	const topicId = event.url.searchParams.get('topicId') || undefined;

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
