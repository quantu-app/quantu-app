import { run } from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit/types/internal';
import { removePrivate } from '.';

export async function get(event: RequestEvent) {
	const departmentUrl: string = event.params.departmentUrl;
	const url: string = event.params.url;

	return run(async (client) => {
		const department = await client.department.findFirst({
			where: {
				url: departmentUrl
			}
		});
		return client.challenge.findUnique({
			where: {
				departmentId_url: {
					url,
					departmentId: department.id
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
	}).then((department) => ({
		body: removePrivate(department),
		status: 200
	}));
}
