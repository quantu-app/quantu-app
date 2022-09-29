import { run } from '$lib/prisma';
import { authenticated } from '$lib/api/auth';
import type { PrismaClient } from '@prisma/client';

export const POST = authenticated(async (event) =>
	run((client) =>
		explain(
			client,
			event.locals.token?.userId as string,
			event.params.type as string,
			event.params.id as string
		)
	).then((result) =>
		result
			? new Response(JSON.stringify(result), { status: 201 })
			: new Response(null, { status: 404 })
	)
);

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

	let data: any = {
		prompt: question.prompt,
		type: question.type,
		value: 0,
		userId: userId,
		challengeId: type === 'challenge' ? id : undefined,
		lessonBlockId: type === 'lesson-block' ? id : undefined
	};

	if (prevResult) {
		data.value = prevResult.value;
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
