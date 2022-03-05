import type { ResultType } from '@prisma/client';
import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';
import { decode } from '$lib/api/jwt';

export async function post(event: RequestEvent) {
	const { userId } = await decode<{ userId: string }>(event.locals.token);
	const resultType = event.params.type.toUpperCase() as ResultType;
	const questionId = event.params.questionId;

	return run(async (client) => {
		const question = await client.challenge.findUnique({
			where: {
				id: questionId
			}
		});

		return client.result.create({
			data: {
				resultType,
				questionId,
				prompt: question.prompt,
				type: question.type,
				value: 0,
				userId
			}
		});
	}).then((result) => ({
		body: result,
		status: 201
	}));
}
