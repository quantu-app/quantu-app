import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const POST = isCreator(async (event) => {
	return {
		body: await run(async (client) =>
			approve(
				client,
				event.params.mergeRequestId,
				event.locals.token?.userId,
				await event.request.json()
			)
		),
		status: 200
	};
});

export function approve(
	client: PrismaClient,
	mergeRequestId: string,
	userId: string,
	approved: boolean | null
) {
	return client.mergeRequestApproval.upsert({
		where: {
			userId_mergeRequestId: {
				mergeRequestId,
				userId
			}
		},
		update: {
			approved
		},
		create: {
			mergeRequestId,
			userId,
			approved
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
