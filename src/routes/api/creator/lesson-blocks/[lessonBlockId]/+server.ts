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
		})
	).then((lessonBlock) => new Response(JSON.stringify(lessonBlock), { status: 200 }));
});

export const PATCH = isCreator(async (event) =>
	run(async (client) =>
		updateLessonBlock(client, event.params.lessonBlockId, await event.request.json())
	).then((lessonBlock) => new Response(JSON.stringify(lessonBlock), { status: 200 }))
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

export const DELETE = isCreator((event) => {
	const lessonBlockId = event.params.lessonBlockId;

	return run(async (client) => {
		const lessonBlock = await client.lessonBlock.delete({
			where: {
				id: lessonBlockId
			},
			select: {
				lessonId: true
			}
		});

		if (lessonBlock) {
			const children = await client.lessonBlock.findMany({
				where: {
					lessonId: lessonBlock.lessonId
				},
				select: {
					id: true
				}
			});
			await Promise.all(
				children.map(({ id }, index) =>
					client.lessonBlock.update({
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
