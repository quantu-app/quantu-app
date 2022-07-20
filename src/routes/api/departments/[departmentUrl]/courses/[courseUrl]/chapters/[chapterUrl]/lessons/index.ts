import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const get = authenticated(async (event) => ({
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
	return await client.lesson.findMany({
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
}
