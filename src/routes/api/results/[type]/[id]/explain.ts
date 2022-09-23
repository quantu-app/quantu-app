import { run } from '$lib/prisma';
import { authenticated } from '$lib/api/auth';
import type { PrismaClient } from '@prisma/client';

export const POST = authenticated(async (event) => ({
	body: await run((client) =>
		explain(client, event.locals.token?.userId, event.params.type, event.params.id)
	),
	status: 201
}));

export async function explain(client: PrismaClient, userId: string, type: string, id: string) {
	const question =
		type === 'challenge'
			? await client.challenge.findUnique({
					where: {
						id
					}
			  })
			: await client.lessonBlock.findUnique({
					where: {
						id
					}
			  });

	if (!question) {
		return null;
	}

	const data: any = {
		prompt: question.prompt,
		type: question.type,
		value: 0,
		userId: userId
	};
	const where: any = {};
	if (type === 'challenge') {
		where.userId_challengeId = {
			userId: userId,
			challengeId: id
		};
		data.challengeId = id;
	} else {
		where.userId_lessonBlockId = {
			userId: userId,
			lessonBlockId: id
		};
		data.lessonBlockId = id;
	}
	return client.result.upsert({
		where,
		update: data,
		create: data
	});
}
