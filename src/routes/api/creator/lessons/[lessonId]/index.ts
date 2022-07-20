import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const GET = isCreator((event) => {
	const lessonId = event.params.lessonId;

	return run((client) =>
		client.lesson.findFirst({
			where: {
				id: lessonId
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
		status: 200
	}));
});

export const PATCH = isCreator(async (event) => {
	const data = await event.request.json();
	const lessonId = event.params.lessonId;

	return run((client) =>
		client.lesson.update({
			where: {
				id: lessonId
			},
			data,
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
		status: 200
	}));
});

export const DELETE = isCreator((event) => {
	const lessonId = event.params.lessonId;

	return run((client) =>
		client.lesson.delete({
			where: {
				id: lessonId
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
		status: 200
	}));
});
