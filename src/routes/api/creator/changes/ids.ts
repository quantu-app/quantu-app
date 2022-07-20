import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const POST = isCreator(async (event) => {
	return {
		body: await run(async (client) => getChangesByIds(client, await event.request.json())),
		status: 200
	};
});

export function getChangesByIds(client: PrismaClient, ids: string[]) {
	return client.change.findMany({
		where: {
			id: { in: ids }
		},
		include: {
			user: {
				select: {
					id: true,
					username: true
				}
			}
		}
	});
}
