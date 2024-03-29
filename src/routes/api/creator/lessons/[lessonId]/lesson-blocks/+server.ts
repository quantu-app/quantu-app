import { isCreator } from '$lib/api/auth';
import { run, transaction } from '$lib/prisma';
import type { Prisma } from '@prisma/client';

export const GET = isCreator((event) => {
	const lessonId = event.params.lessonId;

	return run((client) =>
		client.lessonBlock.findMany({
			where: {
				lessonId: lessonId
			},
			include: {
				lesson: {
					select: {
						id: true,
						url: true,
						name: true,
						index: true,
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
				}
			},
			orderBy: {
				index: 'asc'
			}
		})
	).then((lessonBlocks) => new Response(JSON.stringify(lessonBlocks), { status: 200 }));
});

export const POST = isCreator(async (event) => {
	const data = await event.request.json();
	const lessonId = event.params.lessonId;

	return run((client) => createLessonBlock(client, lessonId, data)).then(
		(lessonBlock) => new Response(JSON.stringify(lessonBlock), { status: 201 })
	);
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
					id: true,
					url: true,
					name: true,
					index: true,
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
			}
		}
	});
}
