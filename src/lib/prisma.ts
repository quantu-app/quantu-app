import type { PrismaClient } from '@prisma/client';
import prisma from '@prisma/client';
import type { MaybePromise } from '@sveltejs/kit/types/internal';

const client = new prisma.PrismaClient();

export function run<T = void>(fn: (client: PrismaClient) => MaybePromise<T>): Promise<T> {
	return client
		.$connect()
		.then(() => fn(client))
		.finally(() => client.$disconnect());
}
