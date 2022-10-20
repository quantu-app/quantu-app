import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async (event: RequestEvent) => {
	const lessonBlock = await run((client) =>
		getLessonBlockByUrl(
			client,
			event.locals.token?.userId as string,
			event.params.departmentUrl as string,
			event.params.courseUrl as string,
			event.params.chapterUrl as string,
			event.params.lessonUrl as string,
			event.params.lessonBlockUrl as string
		)
	);

	return new Response(JSON.stringify(lessonBlock), { status: lessonBlock ? 200 : 404 });
};

export async function getLessonBlockByUrl(
	client: PrismaClient,
	userId: string,
	departmentUrl: string,
	courseUrl: string,
	chapterUrl: string,
	lessonUrl: string,
	lessonBlockUrl: string
) {
	const lessonBlock = await client.lessonBlock.findFirst({
		where: {
			url: lessonBlockUrl,
			visible: true,
			releasedAt: {
				lte: new Date()
			},
			lesson: {
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
			}
		},
		include: {
			lesson: {
				select: {
					name: true,
					url: true,
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
			}
		}
	});

	if (!lessonBlock) {
		return null;
	}

	const [result, answers] = await Promise.all([
		client.result.findFirst({
			where: {
				userId,
				lessonBlockId: lessonBlock.id
			}
		}),
		client.result.findMany({
			where: {
				lessonBlockId: lessonBlock.id
			},
			select: {
				userId: true,
				lessonBlockId: true,
				value: true
			}
		})
	]);

	(lessonBlock as any).result = result;
	(lessonBlock as any).answers = answers;

	return lessonBlock;
}
