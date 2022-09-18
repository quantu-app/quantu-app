import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { Prisma } from '@prisma/client';

export const GET = isCreator((event) => {
	const courseId = event.params.courseId;

	return run((client) =>
		client.chapter.findMany({
			where: {
				courseId
			},
			include: {
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
								id: true,
								url: true,
								name: true
							}
						}
					}
				}
			},
			orderBy: {
				index: 'asc'
			}
		})
	).then((chapters) => ({
		body: chapters,
		status: 200
	}));
});

export const POST = isCreator(async (event) => {
	const data = await event.request.json();
	const courseId = event.params.courseId;

	return run((client) => createChapter(client, courseId, data)).then((chapter) => ({
		body: chapter,
		status: 201
	}));
});

async function createChapter(client: Prisma.TransactionClient, courseId: string, data: any) {
	const {
		_count: { _all: count }
	} = await client.chapter.aggregate({
		_count: { _all: true },
		where: {
			courseId
		}
	});

	return client.chapter.create({
		data: {
			...data,
			index: count,
			course: {
				connect: {
					id: courseId
				}
			}
		},
		include: {
			logo: {
				select: {
					name: true
				}
			},
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
	});
}
