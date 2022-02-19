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

export async function post(event: RequestEvent) {
	const data = await event.request.json();

	return run((client) =>
		client.challenge.create({
			data
		})
	).then((challenge) => ({
		body: challenge,
		status: 201
	}));
}
