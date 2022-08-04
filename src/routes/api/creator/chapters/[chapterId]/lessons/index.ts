import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const GET = isCreator((event) => {
	const chapterId = event.params.chapterId;

	return run((client) =>
		client.lesson.findMany({
			where: {
				chapterId
			},
			include: {
				logo: {
					select: {
						name: true
					}
				},
				chapter: {
					select: {
						url: true,
						name: true,
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
					}
				}
			}
		})
	).then((lessons) => ({
		body: lessons,
		status: 200
	}));
});

export const POST = isCreator(async (event) => {
	const data = await event.request.json();
	const chapterId = event.params.chapterId;

	return run((client) =>
		client.lesson.create({
			data: {
				...data,
				chapter: {
					connect: {
						id: chapterId
					}
				}
			},
			include: {
				logo: {
					select: {
						name: true
					}
				},
				chapter: {
					select: {
						url: true,
						name: true,
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
					}
				}
			}
		})
	).then((lesson) => ({
		body: lesson,
		status: 201
	}));
});
