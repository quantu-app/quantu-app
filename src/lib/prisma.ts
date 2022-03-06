import type { PrismaClient } from '@prisma/client';
import { default as Prisma } from '@prisma/client/index.js';
import type { MaybePromise } from '@sveltejs/kit/types/internal';

const client = new Prisma.PrismaClient();

export function run<T = void>(fn: (client: PrismaClient) => MaybePromise<T>): Promise<T> {
	return client
		.$connect()
		.then(() => fn(client))
		.finally(() => client.$disconnect());
}
