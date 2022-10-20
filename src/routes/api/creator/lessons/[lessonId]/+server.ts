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
				logo: {
					select: {
						name: true
					}
				},
				chapter: {
					select: {
						id: true,
						url: true,
						name: true,
						index: true,
						course: {
							select: {
								id: true,
								url: true,
								name: true,
								department: {
									select: {
										id: true,
										url: true,
										name: true
									}
								}
							}
						}
					}
				}
			}
		})
	).then((lesson) => new Response(JSON.stringify(lesson), { status: 200 }));
});

export const PATCH = isCreator(async (event) => {
	const { index, ...data } = await event.request.json();
	const lessonId = event.params.lessonId;

	return run((client) =>
		client.lesson.update({
			where: {
				id: lessonId
			},
			data,
			include: {
				logo: {
					select: {
						name: true
					}
				},
				chapter: {
					select: {
						id: true,
						url: true,
						name: true,
						index: true,
						course: {
							select: {
								id: true,
								url: true,
								name: true,
								department: {
									select: {
										id: true,
										url: true,
										name: true
									}
								}
							}
						}
					}
				}
			}
		})
	).then((lesson) => new Response(JSON.stringify(lesson), { status: 200 }));
});

export const DELETE = isCreator((event) => {
	const lessonId = event.params.lessonId;

	return run(async (client) => {
		const lesson = await client.lesson.delete({
			where: {
				id: lessonId
			},
			select: {
				chapterId: true
			}
		});

		if (lesson) {
			const children = await client.lesson.findMany({
				where: {
					chapterId: lesson.chapterId
				},
				select: {
					id: true
				}
			});
			await Promise.all(
				children.map(({ id }, index) =>
					client.lesson.update({
						where: {
							id
						},
						data: {
							index
						}
					})
				)
			);
			return new Response(null, {
				status: 204
			});
		} else {
			return new Response(null, {
				status: 404
			});
		}
	});
});
