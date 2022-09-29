import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient, Result } from '@prisma/client';
import { removePrivate } from '../../../../../../../../_utils';

export const GET = authenticated(
	async (event) =>
		new Response(
			JSON.stringify(
				await run((client) =>
					getLessonBlocks(
						client,
						event.locals.token?.userId as string,
						event.params.departmentUrl as string,
						event.params.courseUrl as string,
						event.params.chapterUrl as string,
						event.params.lessonUrl as string
					)
				)
			),
			{
				status: 200
			}
		)
);

export async function getLessonBlocks(
	client: PrismaClient,
	userId: string,
	departmentUrl: string,
	courseUrl: string,
	chapterUrl: string,
	lessonUrl: string
) {
	const lessonBlocks = await client.lessonBlock.findMany({
		where: {
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
		},
		orderBy: {
			index: 'asc'
		}
	});

	const lessonBlockIds = lessonBlocks.map((lessonBlock) => lessonBlock.id);
	const [results, answers] = await Promise.all([
		client.result.findMany({
			where: {
				userId,
				lessonBlockId: {
					in: lessonBlockIds
				}
			}
		}),
		client.result.findMany({
			where: {
				lessonBlockId: {
					in: lessonBlockIds
				}
			},
			select: {
				userId: true,
				lessonBlockId: true,
				value: true
			}
		})
	]);

	const resultMap = results.reduce((map, result) => {
		map[result.lessonBlockId as string] = result;
		return map;
	}, {} as Record<string, Result>);

	const answersMap = answers.reduce((map, answer) => {
		const values =
			map[answer.lessonBlockId as string] || (map[answer.lessonBlockId as string] = []);
		values.push({ value: answer.value, userId: answer.userId });
		return map;
	}, {} as Record<string, { value: number; userId: string }[]>);

	return lessonBlocks.map((lessonBlock) => {
		(lessonBlock as any).result = resultMap[lessonBlock.id];
		(lessonBlock as any).answers = answersMap[lessonBlock.id] || [];
		return removePrivate(lessonBlock);
	});
}
