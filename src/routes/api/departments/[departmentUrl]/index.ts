import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export const GET = async (event: RequestEvent) => {
	const department = await run((client) => getDepartmentByUrl(client, event.params.departmentUrl));
	return {
		body: department,
		status: department ? 200 : 404
	};
};

export function getDepartmentByUrl(client: PrismaClient, departmentUrl: string) {
	return client.department.findUnique({
		where: {
			url: departmentUrl
		}
	});
}
