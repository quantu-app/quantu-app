import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient, LessonBlock } from '@prisma/client';

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
			visible: true,
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
	const lessonBlocks = await client.lessonBlock.findMany({
		where: {
			visible: true,
			lessonId: {
				in: lessonIds
			}
		}
	});

	const lessonBlocksByLessonId = lessonBlocks.reduce((byLessonId, lessonBlock) => {
		byLessonId[lessonBlock.lessonId] ||= [];
		byLessonId[lessonBlock.lessonId].push(lessonBlock);
		return byLessonId;
	}, {} as { [lessonId: string]: LessonBlock[] });

	for (const lesson of lessons) {
		(lesson as any).lessonBlocks = lessonBlocksByLessonId[lesson.id];
		(lesson as any).lessonBlocksCount = lessonBlocksByLessonId[lesson.id] ? lessonBlocksByLessonId[lesson.id].length : 0;
	}

	return lessons;
}
