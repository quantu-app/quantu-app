import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = isCreator((event: RequestEvent) => {
	const id = event.params.id;

	return run((client) =>
		client.asset.findUnique({
			where: { id }
		})
	).then((asset) => new Response(JSON.stringify(asset), { status: 200 }));
});
