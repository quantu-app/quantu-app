import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { Prisma, PrismaClient } from '@prisma/client';

export const get = isCreator(async (event) => {
	return {
		body: await run((client) => getChanges(client, event.params.changeId)),
		status: 200
	};
});

export function getChanges(client: PrismaClient, changeId: string) {
	return client.change.findUnique({
		where: {
			id: changeId
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

export const patch = isCreator(async (event) => ({
	body: await run(async (client) =>
		updateChange(
			client,
			event.params.changeId,
			event.locals.token.userId,
			await event.request.json()
		)
	),
	status: 200
}));

export async function updateChange(
	client: PrismaClient,
	changeId: string,
	userId: string,
	value: Prisma.InputJsonObject
) {
	const change = await client.change.findFirst({
		where: {
			id: changeId,
			userId,
			latest: true
		}
	});

	return client.change.update({
		where: {
			id: changeId
		},
		data: {
			value,
			referenceType: change.referenceType,
			referenceId: change.referenceId,
			prevChange: change.prevChangeId
				? {
						connect: {
							id: change.prevChangeId
						}
				  }
				: undefined,
			latest: change.latest,
			user: {
				connect: {
					id: userId
				}
			}
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
