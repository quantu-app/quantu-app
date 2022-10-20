import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';

export const DELETE = async (event: RequestEvent) => {
	await run((client) =>
		deleteResultsForLesson(
			client,
			event.params.lessonUrl as string,
			event.locals.token?.userId as string
		)
	);

	return new Response(undefined, { status: 204 });
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
