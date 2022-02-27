import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';
import { getTopicsByUrl } from '../../topics/url/[...urls]';

export async function get(event: RequestEvent) {
	const urls: string[] = event.params.urls.split('/');
	const url: string = urls.pop();

	return run(async (client) => {
		const topics = await getTopicsByUrl(client, urls);
		const parentTopic = topics[topics.length - 1];
		return parentTopic
			? client.challenge.findUnique({
					where: {
						topicId_url: { url: url, topicId: parentTopic.id }
					},
					include: {
						topic: true
					}
			  })
			: client.challenge.findFirst({
					where: {
						url,
						topicId: undefined
					},
					include: {
						topic: true
					}
			  });
	}).then((topic) => ({
		body: topic,
		status: 200
	}));
}
