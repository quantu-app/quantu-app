import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export const GET = async (event: RequestEvent) => {
	const course = await run((client) =>
		getCourseByUrl(
			client,
			event.params.departmentUrl,
			event.params.courseUrl,
			event.locals.token?.userId as string
		)
	);

	return {
		body: course,
		status: course ? 200 : 404
	};
};

export async function getCourseByUrl(
	client: PrismaClient,
	departmentUrl: string,
	courseUrl: string,
	userId: string
) {
	const lessonBlocks = await client.lessonBlock.findMany({
		where: {
			lesson: {
				chapter: {
					course: {
						url: courseUrl
					}
				}
			}
		}
	});
	const lessonBlockIds = lessonBlocks.map((lessonBlock) => lessonBlock.id);
	const {
		_avg: { value: result },
		_count: { _all: results }
	} = await client.result.aggregate({
		_avg: { value: true },
		_count: { _all: true },
		where: {
			userId,
			lessonBlockId: {
				in: lessonBlockIds
			}
		}
	});

	const course = await client.course.findFirst({
		where: {
			url: courseUrl,
			department: {
				url: departmentUrl
			}
		},
		include: {
			department: {
				select: {
					url: true,
					name: true
				}
			}
		}
	});

	(course as any).result = result;
	(course as any).finished = results === lessonBlocks.length;

	return course;
}
