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

	const prevResult = await client.result.findFirst({
		where:
			type === 'challenge'
				? {
						userId,
						challengeId: id
				  }
				: {
						userId,
						lessonBlockId: id
				  }
	});

	const data: any = {
		prompt: question.prompt,
		type: question.type,
		value: 0,
		userId: userId,
		challengeId: type === 'challenge' ? id : undefined,
		lessonBlockId: type === 'lesson-block' ? id : undefined
	};

	if (prevResult) {
		return client.result.update({
			where: {
				id: prevResult.id
			},
			data
		});
	} else {
		return client.result.create({
			data
		});
	}
}
