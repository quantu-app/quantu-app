import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

const DEFAULT_PAGINATION_SIZE = 25;

export const GET = authenticated(async (event) => {
	const pageString = event.url.searchParams.get('page');
	const sizeString = event.url.searchParams.get('size');
	const courses = await run((client) =>
		getCourses(
			client,
			event.locals.token?.userId as string,
			pageString ? parseInt(pageString) : undefined,
			sizeString ? parseInt(sizeString) : undefined,
			event.params.departmentUrl
		)
	);
	return new Response(JSON.stringify(courses), {
		status: 200
	});
});

export async function getCourses(
	client: PrismaClient,
	userId: string,
	page?: number,
	size?: number,
	departmentUrl?: string
) {
	page = page ? page : 0;
	size = size ? size : DEFAULT_PAGINATION_SIZE;

	const where = {
		visible: true,
		releasedAt: {
			lte: new Date()
		}
	};
	if (departmentUrl) {
		(where as any).department = { url: departmentUrl };
	}

	return await client.course.findMany({
		where,
		skip: page * size,
		take: size,
		include: {
			department: {
				select: {
					url: true,
					name: true
				}
			}
		},
		orderBy: {
			releasedAt: 'desc'
		}
	});
}
