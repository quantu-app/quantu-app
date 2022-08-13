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
			event.params.lessonUrl
		)
	),
	status: 200
}));

export async function getLessons(
	client: PrismaClient,
	departmentUrl: string,
	courseUrl: string,
	chapterUrl: string,
	lessonUrl: string
) {
	const lessons = await client.lesson.findMany({
		where: {
			url: lessonUrl,
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

	const lessonIds = lessons.map((lesson) => lesson.id);
	const lessonBlockCounts = await client.lessonBlock.groupBy({
		by: ['lessonId'],
		_count: { _all: true },
		where: {
			lessonId: {
				in: lessonIds
			}
		}
	});

	const lessonBlockCountByLessonId = lessonBlockCounts.reduce((byLessonId, lessonBlockCount) => {
		byLessonId[lessonBlockCount.lessonId] = lessonBlockCount._count._all;
		return byLessonId;
	}, {} as { [lessonId: string]: number });

	for (const lesson of lessons) {
		(lesson as any).blocks = lessonBlockCountByLessonId[lesson.id] || 0;
	}

	return lessons;
}
