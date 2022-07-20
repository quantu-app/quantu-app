import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const GET = authenticated(async (event) => ({
	body: await run((client) =>
		getChapters(client, event.params.departmentUrl, event.params.courseUrl)
	),
	status: 200
}));

export async function getChapters(client: PrismaClient, departmentUrl: string, courseUrl: string) {
	return await client.chapter.findMany({
		where: {
			course: {
				department: {
					url: departmentUrl
				},
				url: courseUrl
			}
		},
		include: {
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
	});
}
