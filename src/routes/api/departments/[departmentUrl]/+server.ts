import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async (event: RequestEvent) => {
	const department = await run((client) => getDepartmentByUrl(client, event.params.departmentUrl));
	// Suggestion (check for correctness before using):
	// return json(department, {
	// 	status: department ? 200 : 404
	// });
	return new Response(JSON.stringify(department), { status: department ? 200 : 404 });
};

export function getDepartmentByUrl(client: PrismaClient, departmentUrl: string) {
	return client.department.findUnique({
		where: {
			url: departmentUrl
		}
	});
}
