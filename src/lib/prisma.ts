import { PrismaClient } from '@prisma/client';
import type { MaybePromise } from '@sveltejs/kit/types/helper';

const client = new PrismaClient();

export function run<T = void>(fn: (client: PrismaClient) => MaybePromise<T>): Promise<T> {
	return client
		.$connect()
		.then(() => fn(client))
		.finally(() => client.$disconnect());
}
