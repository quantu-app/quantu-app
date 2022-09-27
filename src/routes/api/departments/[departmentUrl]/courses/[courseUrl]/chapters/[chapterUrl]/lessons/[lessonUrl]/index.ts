import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export const GET = async (event: RequestEvent) => {
	const lesson = await run((client) =>
		getLessonByUrl(
			client,
			event.params.departmentUrl,
			event.params.courseUrl,
			event.params.chapterUrl,
			event.params.lessonUrl,
			event.locals.token?.userId,
		)
	);

	return {
		body: lesson,
		status: lesson ? 200 : 404
	};
};

export async function getLessonByUrl(
	client: PrismaClient,
	departmentUrl: string,
	courseUrl: string,
	chapterUrl: string,
	lessonUrl: string,
	userId: string
) {
	const now = new Date();

	const lesson = await client.lesson.findFirst({
		where: {
			url: lessonUrl,
			chapter: {
				url: chapterUrl,
				course: {
					url: courseUrl,
					department: {
						url: departmentUrl
					}
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
	});

	if (lesson) {
		(lesson as any).lessonBlockCount = lesson.lessonBlocks.length;
		lesson.lessonBlocks.forEach((v) => {
			const result = v.results.find((r) => r.userId == userId);
			(v as any).result = result;
		});
	}

	return lesson;
}
