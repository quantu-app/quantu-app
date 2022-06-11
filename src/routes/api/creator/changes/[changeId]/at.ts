import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { Prisma, PrismaClient } from '@prisma/client';

export const get = isCreator((event) =>
	run((client) => getChangeValueAt(client, event.params.changeId)).then((change) => ({
		body: change,
		status: change ? 200 : 404
	}))
);

export function getChangeValueAt(client: PrismaClient, changeId: string) {
	return getChangeValueAtRecur(client, changeId, {});
}

async function getChangeValueAtRecur(
	client: PrismaClient,
	changeId: string,
	currentValue: Prisma.JsonObject
): Promise<Prisma.JsonObject> {
	const change = await client.change.findUnique({
		where: {
			id: changeId
		},
		select: {
			value: true,
			prevChangeId: true
		}
	});
	if (!change) {
		return currentValue;
	}
	const newValue = Object.assign({}, change.value || {}, currentValue);
	if (change.prevChangeId) {
		return getChangeValueAtRecur(client, change.prevChangeId, newValue);
	} else {
		return newValue;
	}
}
