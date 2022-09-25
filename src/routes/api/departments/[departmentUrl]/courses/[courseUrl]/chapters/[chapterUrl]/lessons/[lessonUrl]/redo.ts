import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export const DELETE = async (event: RequestEvent) => {
	await run((client) =>
		deleteResultsForLesson(client, event.params.lessonUrl, event.locals.token?.userId as string)
	);

	return {
		status: 200
	};
};

export async function deleteResultsForLesson(
	client: PrismaClient,
	lessonUrl: string,
	userId: string
) {
	const lessonBlocks = await client.lessonBlock.findMany({
		where: {
			lesson: {
				url: lessonUrl
			}
		}
	});

	const results = await client.result.deleteMany({
		where: {
			lessonBlockId: {
				in: lessonBlocks.map((v) => v.id)
			},
			userId: userId
		}
	});

	return results;
}
