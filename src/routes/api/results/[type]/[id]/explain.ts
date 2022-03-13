import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';
import { decode } from '$lib/api/jwt';

export async function post(event: RequestEvent) {
	const { userId } = await decode<{ userId: string }>(event.locals.token);
	const id = event.params.id;

	return run(async (client) => {
		const question = await client.challenge.findUnique({
			where: {
				id: id
			}
		});

		return client.result.create({
			data: {
				challengeId: id,
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
