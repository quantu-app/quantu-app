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
	return await client.course.findFirst({
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
}
