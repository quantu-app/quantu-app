import { decode } from '$lib/api/jwt';
import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export async function get(event: RequestEvent) {
	await decode<{ userId: string }>(event.locals.token);

	const departmentId = event.params.departmentId;

	return run((client) =>
		client.challenge.findMany({
			where: {
				departmentId
			},
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
		body: challenges,
		status: 200
	}));
}

export async function post(event: RequestEvent) {
	await decode<{ userId: string }>(event.locals.token);

	const data = await event.request.json();
	const departmentId = event.params.departmentId;

	return run((client) =>
		client.challenge.create({
			data: {
				...data,
				departmentId
			},
			include: {
				department: {
					select: {
						url: true,
						name: true
					}
				}
			}
		})
	).then((challenge) => ({
		body: challenge,
		status: 201
	}));
}
