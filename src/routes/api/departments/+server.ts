import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const GET = authenticated(
	async () => new Response(await run(getDepartments), { status: 200 })
);

export async function getDepartments(client: PrismaClient) {
	return client.department.findMany();
}
