import type { RequestEvent } from '@sveltejs/kit';
import { run } from 'svelte/internal';

export async function get(event: RequestEvent) {
	const parentId = event.url.searchParams.get('parentId');

	return run((client) =>
		client.challenge.findMany({
			where: {
				parentId: parentId
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
