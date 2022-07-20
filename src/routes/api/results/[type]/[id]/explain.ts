import { run } from '$lib/prisma';
import { authenticated } from '$lib/api/auth';
import type { PrismaClient } from '@prisma/client';

export const POST = authenticated(async (event) => ({
	body: await run((client) => explain(client, event.locals.token.userId, event.params.id)),
	status: 201
}));

export async function explain(client: PrismaClient, userId: string, challengeId: string) {
	const question = await client.challenge.findUnique({
		where: {
			id: challengeId
		}
	});

	const data = {
		challengeId,
		prompt: question.prompt,
		type: question.type,
		value: 0,
		userId: userId
	};
	return client.result.upsert({
		where: {
			userId_challengeId: {
				userId: userId,
				challengeId
			}
		},
		update: data,
		create: data
	});
}
