import { isCreator } from '$lib/api/auth';
import { transaction } from '$lib/prisma';

export const PATCH = isCreator(async (event) => {
	const newOrder: { id: string; index: number }[] = await event.request.json();

	return transaction(async (client) => {
		const include = {
			logo: {
				select: {
					name: true
				}
			},
			course: {
				select: {
					url: true,
					name: true,
					department: {
						select: {
							url: true,
							name: true
						}
					}
				}
			}
		};

		await Promise.all(
			newOrder.map(({ id, index }) =>
				client.chapter.update({
					where: {
						id
					},
					data: {
						index
					},
					include
				})
			)
		);
	}).then(() => ({
		status: 204
	}));
});
