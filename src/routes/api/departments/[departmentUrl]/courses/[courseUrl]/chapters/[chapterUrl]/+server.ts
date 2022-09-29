import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async (event: RequestEvent) => {
	const chapter = await run((client) =>
		getChapterByUrl(
			client,
			event.params.departmentUrl as string,
			event.params.courseUrl as string,
			event.params.chapterUrl as string
		)
	);
	return new Response(JSON.stringify(chapter), { status: chapter ? 200 : 404 });
};

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
