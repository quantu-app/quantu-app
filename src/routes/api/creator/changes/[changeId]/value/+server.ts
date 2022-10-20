import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { Prisma, PrismaClient } from '@prisma/client';

export const GET = isCreator((event) =>
	run((client) => getChangeValueAt(client, event.params.changeId as string)).then(
		(change) => new Response(JSON.stringify(change), { status: change ? 200 : 404 })
	)
);

export async function getChangeValueAt(client: PrismaClient, changeId: string) {
	if (changeId === null) {
		return null;
	}
	const changes: Prisma.JsonObject[] = [];
	while (true) {
		const change = await client.change.findUnique({
			where: {
				id: changeId
			},
			select: {
				value: true,
				prevChangeId: true
			}
		});
		if (change) {
			changes.push(change.value as Prisma.JsonObject);
			if (change.prevChangeId) {
				changeId = change.prevChangeId;
			} else {
				break;
			}
		} else {
			break;
		}
	}
	if (changes.length === 0) {
		return null;
	}
	return changes.reduce(
		(value, nextValue) => Object.assign(value, nextValue),
		{} as Prisma.JsonObject
	);
}
