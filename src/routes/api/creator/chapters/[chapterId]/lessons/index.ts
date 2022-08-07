import { isCreator } from '$lib/api/auth';
import { run, transaction } from '$lib/prisma';
import type { Prisma } from '@prisma/client';

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
						index: true,
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
			},
			orderBy: {
				index: 'asc'
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

	return transaction((client) => createLesson(client, chapterId, data)).then((lesson) => ({
		body: lesson,
		status: 201
	}));
});

export async function createLesson(client: Prisma.TransactionClient, chapterId: string, data: any) {
	const {
		_count: { _all: count }
	} = await client.lesson.aggregate({
		_count: { _all: true },
		where: {
			chapterId
		}
	});

	return client.lesson.create({
		data: {
			...data,
			index: count,
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
					index: true,
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
	});
}
