import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export const DELETE = async (event: RequestEvent) => {
    await run((client) =>
        deleteResultsForLesson(
            client,
            event.params.lessonUrl,
            event.locals.token?.userId
        )
    );

    return {
        status: 200
    };
};

export async function deleteResultsForLesson(
    client: PrismaClient,
    lessonId: string,
    userId: string
) {
    const lessonBlocks = await client.lessonBlock.findMany({
        where: {
            lessonId: lessonId
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
