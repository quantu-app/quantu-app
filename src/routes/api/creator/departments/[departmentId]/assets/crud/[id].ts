import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export const get = authenticated((event: RequestEvent) => {
	const id = event.params.id;

	return run((client) =>
		client.asset.findUnique({
			where: { id }
		})
	).then((asset) => ({
		body: asset,
		status: 200
	}));
});
