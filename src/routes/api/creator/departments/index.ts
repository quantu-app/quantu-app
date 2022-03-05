import { decode } from '$lib/api/jwt';
import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export async function get(event: RequestEvent) {
	await decode<{ userId: string }>(event.locals.token);

	return run((client) => client.department.findMany()).then((departments) => ({
		body: departments,
		status: 200
	}));
}

export async function post(event: RequestEvent) {
	await decode<{ userId: string }>(event.locals.token);

	const data = await event.request.json();

	return run((client) =>
		client.department.create({
			data
		})
	).then((department) => ({
		body: department,
		status: 201
	}));
}
