import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const GET = authenticated(async (event) => ({
	body: await run((client) =>
		getLessons(
			client,
			event.params.departmentUrl,
			event.params.courseUrl,
			event.params.chapterUrl,
			event.params.lessonUrl,
			event.locals.token?.userId,
		)
	),
	status: 200
}));

export async function getLessons(
	client: PrismaClient,
	departmentUrl: string,
	courseUrl: string,
	chapterUrl: string,
	lessonUrl: string,
	userId: string
) {
	const now = new Date();

	const lessons = await client.lesson.findMany({
		where: {
			url: lessonUrl,
			visible: true,
			releasedAt: {
				lte: now
			},
			NOT: [{ releasedAt: null }],
			chapter: {
				url: chapterUrl,
				course: {
					department: {
						url: departmentUrl
					},
					url: courseUrl
				}
			}
		},
		include: {
			lessonBlocks: {
				where: {
					visible: true,
					NOT: [{ releasedAt: null }],
					releasedAt: {
						lte: now
					}
				},
				include: {
					results: {
						where: {
							userId
						}
					}
				}
			},
			chapter: {
				select: {
					name: true,
					url: true,
					course: {
						select: {
							name: true,
							url: true,
							department: {
								select: {
									name: true,
									url: true
								}
							}
						}
					}
				}
			}
		}
	});

	for (const lesson of lessons) {
		(lesson as any).lessonBlocksCount = lesson.lessonBlocks.length;
	}

	return lessons;
}
