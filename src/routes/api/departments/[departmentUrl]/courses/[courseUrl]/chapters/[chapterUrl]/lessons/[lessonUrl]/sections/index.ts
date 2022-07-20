import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient, Result } from '@prisma/client';
import { removePrivate } from 'src/routes/api/departments/_utils';

export const get = authenticated(async (event) => ({
	body: await run((client) =>
		getSections(
			client,
			event.locals.token.userId,
			event.params.departmentUrl,
			event.params.courseUrl,
			event.params.chapterUrl,
			event.params.lessonUrl
		)
	),
	status: 200
}));

export async function getSections(
	client: PrismaClient,
	userId: string,
	departmentUrl: string,
	courseUrl: string,
	chapterUrl: string,
	lessonUrl: string
) {
	const sections = await client.section.findMany({
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

	const sectionIds = sections.map((section) => section.id);
	const [results, answers] = await Promise.all([
		client.result.findMany({
			where: {
				userId,
				sectionId: {
					in: sectionIds
				}
			}
		}),
		client.result.findMany({
			where: {
				sectionId: {
					in: sectionIds
				}
			},
			select: {
				userId: true,
				sectionId: true,
				value: true
			}
		})
	]);

	const resultMap = results.reduce((map, result) => {
		map[result.sectionId as string] = result;
		return map;
	}, {} as Record<string, Result>);

	const answersMap = answers.reduce((map, answer) => {
		const values = map[answer.sectionId as string] || (map[answer.sectionId as string] = []);
		values.push({ value: answer.value, userId: answer.userId });
		return map;
	}, {} as Record<string, { value: number; userId: string }[]>);

	return sections.map((section) => {
		(section as any).result = resultMap[section.id];
		(section as any).answers = answersMap[section.id] || [];
		return removePrivate(section);
	});
}
