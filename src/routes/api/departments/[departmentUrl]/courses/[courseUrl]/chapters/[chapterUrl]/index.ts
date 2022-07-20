import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export async function get(event: RequestEvent) {
	const chapter = await run((client) =>
		getChapterByUrl(
			client,
			event.params.departmentUrl,
			event.params.courseUrl,
			event.params.chapterUrl
		)
	);

	return {
		body: chapter,
		status: chapter ? 200 : 404
	};
}

export async function getChapterByUrl(
	client: PrismaClient,
	departmentUrl: string,
	courseUrl: string,
	chapterUrl: string
) {
	return await client.chapter.findFirst({
		where: {
			url: chapterUrl,
			course: {
				url: courseUrl,
				department: {
					url: departmentUrl
				}
			}
		},
		include: {
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
	});
}
