import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export async function get(_event: RequestEvent) {
	return run((client) => client.department.findMany()).then((departments) => ({
		body: departments,
		status: 200
	}));
}
