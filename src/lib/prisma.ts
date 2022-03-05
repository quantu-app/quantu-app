import { dev } from '$app/env';
import type { PrismaClient } from '@prisma/client';
import Prisma, * as PrismaAll from '@prisma/client';
const Client = Prisma?.PrismaClient || PrismaAll?.PrismaClient;
import type { MaybePromise } from '@sveltejs/kit/types/internal';

const client = new Client({
	log: dev ? ['query', 'info', 'warn', 'error'] : ['error']
});

export function run<T = void>(fn: (client: PrismaClient) => MaybePromise<T>): Promise<T> {
	return client
		.$connect()
		.then(() => fn(client))
		.finally(() => client.$disconnect());
}
