import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

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

	return run((client) =>
		client.lessonBlock.create({
			data: {
				...data,
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
		status: 201
	}));
});
