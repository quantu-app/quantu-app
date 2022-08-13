import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export const GET = async (event: RequestEvent) => {
	const course = await run((client) =>
		getCourseByUrl(client, event.params.departmentUrl, event.params.courseUrl)
	);

	return {
		body: course,
		status: course ? 200 : 404
	};
};

export async function getCourseByUrl(
	client: PrismaClient,
	departmentUrl: string,
	courseUrl: string
) {
	const chapters = await client.chapter.findMany({
		where: {
			course: {
				url: courseUrl,
				department: {
					url: departmentUrl
				}
			}
		},
		select: {
			id: true
		}
	});
	const chapterIds = chapters.map((chapter) => chapter.id);
	const {
		_count: { _all: lessonCount }
	} = await client.lesson.aggregate({
		_count: { _all: true },
		where: {
			chapterId: {
				in: chapterIds
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

	(course as any).finished = false; // TODO: add user course progress
	(course as any).lessons = lessonCount;

	return course;
}
