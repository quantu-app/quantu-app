import { run } from '$lib/prisma';
import type { Topic } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export async function get(event: RequestEvent) {
	let currentId = event.params.id;

	return run(async (client) => {
		const topics: Topic[] = [];
		while (currentId != null) {
			const topic = await client.topic.findUnique({
				where: {
					id: currentId
				}
			});
			if (topic) {
				currentId = topic.parentId;
				topics.unshift(topic);
			} else {
				break;
			}
		}
		return topics;
	}).then((topics) => ({
		body: topics,
		status: 200
	}));
}
