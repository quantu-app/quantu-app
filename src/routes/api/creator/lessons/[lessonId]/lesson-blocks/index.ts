import { isCreator } from '$lib/api/auth';
import { run, transaction } from '$lib/prisma';
import type { Prisma } from '@prisma/client';

export const GET = isCreator((event) => {
	const lessonBlockId = event.params.lessonBlockId;

	return run((client) =>
		client.lessonBlock.findMany({
			where: {
				id: lessonBlockId
			},
			include: {
				lesson: {
					select: {
						url: true,
						name: true,
						index: true,
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
				}
			},
			orderBy: {
				index: 'asc'
			}
		})
	).then((lessonBlocks) => ({
		body: lessonBlocks,
		status: 200
	}));
});

export const POST = isCreator(async (event) => {
	const data = await event.request.json();
	const lessonId = event.params.lessonId;

	return transaction((client) => createLessonBlock(client, lessonId, data)).then((lessonBlock) => ({
		body: lessonBlock,
		status: 201
	}));
});

export async function createLessonBlock(
	client: Prisma.TransactionClient,
	lessonId: string,
	data: any
) {
	const {
		_count: { _all: count }
	} = await client.lessonBlock.aggregate({
		_count: { _all: true },
		where: {
			lessonId
		}
	});

	return client.lessonBlock.create({
		data: {
			...data,
			index: count,
			lesson: {
				connect: {
					id: lessonId
				}
			}
		},
		include: {
			lesson: {
				select: {
					url: true,
					name: true,
					index: true,
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
			}
		}
	});
}
