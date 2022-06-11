import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { Prisma, PrismaClient } from '@prisma/client';

export const get = isCreator((event) =>
	run((client) => getChange(client, event.params.changeId)).then((change) => ({
		body: change,
		status: change ? 200 : 404
	}))
);

export function getChange(client: PrismaClient, changeId: string) {
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

export const patch = isCreator((event) =>
	run(async (client) => {
		const { name, value } = await event.request.json();
		return updateChange(client, event.params.changeId, event.locals.token.userId, name, value);
	}).then((change) => ({
		body: change,
		status: change ? 200 : 404
	}))
);

export async function updateChange(
	client: PrismaClient,
	changeId: string,
	userId: string,
	name: string,
	value: Prisma.InputJsonObject
) {
	const change = await client.change.findFirst({
		where: {
			id: changeId,
			userId,
			latest: true
		}
	});

	if (!change) {
		return null;
	}

	return client.change.update({
		where: {
			id: changeId
		},
		data: {
			name,
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
