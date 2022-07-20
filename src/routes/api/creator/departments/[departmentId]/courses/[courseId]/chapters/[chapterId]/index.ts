import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const get = isCreator((event) => {
	const chapterId = event.params.chapterId;

	return run((client) =>
		client.chapter.findFirst({
			where: {
				id: chapterId
			},
			include: {
				course: {
					select: {
						url: true,
						name: true
					}
				}
			}
		})
	).then((chapter) => ({
		body: chapter,
		status: 200
	}));
});

export const patch = isCreator(async (event) => {
	const data = await event.request.json();
	const chapterId = event.params.chapterId;

	return run((client) =>
		client.chapter.update({
			where: {
				id: chapterId
			},
			data,
			include: {
				course: {
					select: {
						url: true,
						name: true
					}
				}
			}
		})
	).then((chapter) => ({
		body: chapter,
		status: 200
	}));
});

export const del = isCreator((event) => {
	const chapterId = event.params.chapterId;

	return run((client) =>
		client.chapter.delete({
			where: {
				id: chapterId
			},
			include: {
				course: {
					select: {
						url: true,
						name: true
					}
				}
			}
		})
	).then((chapter) => ({
		body: chapter,
		status: 200
	}));
});
