import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit/types/internal';

export const GET = async (event: RequestEvent) => {
    const lessonBlock = await run((client) =>
        getLessonBlockByUrl(
            client,
            event.params.departmentUrl,
            event.params.courseUrl,
            event.params.chapterUrl,
            event.params.lessonUrl,
            event.params.lessonBlockUrl
        )
    );

    return {
        body: lessonBlock,
        status: lessonBlock ? 200 : 404
    };
};

export async function getLessonBlockByUrl(
    client: PrismaClient,
    departmentUrl: string,
    courseUrl: string,
    chapterUrl: string,
    lessonUrl: string,
    lessonBlockUrl: string
) {
    const lessonBlock = await client.lessonBlock.findFirst({
        where: {
            url: lessonBlockUrl,
            visible: true,
            NOT: [{ releasedAt: null }],
            releasedAt: {
                lte: new Date()
            },
            lesson: {
                url: lessonUrl,
                chapter: {
                    url: chapterUrl,
                    course: {
                        department: {
                            url: departmentUrl
                        },
                        url: courseUrl
                    }
                }
            }
        },
        include: {
            lesson: {
                select: {
                    name: true,
                    url: true,
                    chapter: {
                        select: {
                            name: true,
                            url: true,
                            course: {
                                select: {
                                    name: true,
                                    url: true,
                                    department: {
                                        select: {
                                            name: true,
                                            url: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    return lessonBlock;
}
