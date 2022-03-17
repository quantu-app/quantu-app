import { run } from '$lib/prisma';
import { authenticated } from '$lib/api/auth';

export const post = authenticated((event) => {
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
				userId: event.locals.token.userId
			}
		});
	}).then((result) => ({
		body: result,
		status: 201
	}));
});
