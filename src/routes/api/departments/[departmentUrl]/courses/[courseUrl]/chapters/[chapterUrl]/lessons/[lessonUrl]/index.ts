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
			event.params.lessonUrl
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
	lessonUrl: string
) {
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
		const {
			_count: { _all: lessonBlockCount }
		} = await client.lessonBlock.aggregate({
			_count: { _all: true },
			where: {
				lessonId: lesson.id
			}
		});
		(lesson as any).blocks = lessonBlockCount;
	}

	return lesson;
}
