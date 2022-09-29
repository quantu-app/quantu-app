import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const GET = authenticated(
	async (event) =>
		new Response(
			JSON.stringify(
				await run((client) =>
					getLessons(
						client,
						event.params.departmentUrl as string,
						event.params.courseUrl as string,
						event.params.chapterUrl as string,
						event.params.lessonUrl as string,
						event.locals.token?.userId as string
					)
				)
			),
			{
				status: 200
			}
		)
);

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
		lesson.lessonBlocks.forEach((v) => {
			const result = v.results.find((r) => r.userId == userId);
			(v as any).result = result;
		});
	}

	return lessons;
}
