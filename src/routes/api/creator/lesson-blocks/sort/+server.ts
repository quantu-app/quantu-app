import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const PATCH = isCreator(async (event) => {
	const newOrder: { id: string; index: number }[] = await event.request.json();

	return run(async (client) => {
		await Promise.all(
			newOrder.map(({ id, index }) =>
				client.lessonBlock.update({
					where: {
						id
					},
					data: {
						index
					}
				})
			)
		);
	}).then(
		() =>
			new Response(null, {
				status: 204
			})
	);
});
