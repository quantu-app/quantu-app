import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const GET = isCreator((event) => {
	const lessonBlockId = event.params.lessonBlockId;

	return run((client) =>
		client.lessonBlock.findFirst({
			where: {
				id: lessonBlockId
			},
			include: {
				lesson: {
					select: {
						url: true,
						name: true,
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
				}
			}
		})
	).then((lessonBlock) => ({
		body: lessonBlock,
		status: 200
	}));
});

export const PATCH = isCreator(async (event) =>
	run(async (client) =>
		updateLessonBlock(client, event.params.lessonBlockId, await event.request.json())
	).then((lessonBlock) => ({
		body: lessonBlock,
		status: 200
	}))
);

export async function updateLessonBlock(client: PrismaClient, lessonBlockId: string, data: any) {
	delete data.index;
	return client.lessonBlock.update({
		where: {
			id: lessonBlockId
		},
		data,
		include: {
			lesson: {
				select: {
					url: true,
					name: true,
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
			}
		}
	});
}

export const DELETE = isCreator((event) => {
	const lessonBlockId = event.params.lessonBlockId;

	return run((client) =>
		client.lessonBlock.delete({
			where: {
				id: lessonBlockId
			},
			include: {
				lesson: {
					select: {
						url: true,
						name: true,
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
				}
			}
		})
	).then((lessonBlock) => ({
		body: lessonBlock,
		status: 200
	}));
});
