import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const get = isCreator((event) => {
	const chapterId = event.params.chapterId;

	return run((client) =>
		client.lesson.findMany({
			where: {
				chapterId
			},
			include: {
				chapter: {
					select: {
						url: true,
						name: true
					}
				}
			}
		})
	).then((lessons) => ({
		body: lessons,
		status: 200
	}));
});

export const post = isCreator(async (event) => {
	const data = await event.request.json();
	const chapterId = event.params.chapterId;

	return run((client) =>
		client.lesson.create({
			data: {
				...data,
				chapterId
			},
			include: {
				chapter: {
					select: {
						url: true,
						name: true
					}
				}
			}
		})
	).then((lesson) => ({
		body: lesson,
		status: 201
	}));
});
