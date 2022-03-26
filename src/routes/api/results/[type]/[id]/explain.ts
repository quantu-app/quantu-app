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

		const data = {
			challengeId: id,
			prompt: question.prompt,
			type: question.type,
			value: 0,
			userId: event.locals.token.userId
		};
		return client.result.upsert({
			where: {
				userId_challengeId: {
					userId: event.locals.token.userId,
					challengeId: id
				}
			},
			update: data,
			create: data
		});
	}).then((result) => ({
		body: result,
		status: 201
	}));
});
