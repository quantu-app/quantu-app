import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const GET = isCreator((event) => {
	const courseId = event.params.courseId;

	return run((client) =>
		client.chapter.findMany({
			where: {
				courseId
			},
			include: {
				logo: {
					select: {
						name: true
					}
				},
				course: {
					select: {
						url: true,
						name: true,
						department: {
							select: {
								url: true,
								name: true
							}
						}
					}
				}
			}
		})
	).then((chapters) => ({
		body: chapters,
		status: 200
	}));
});

export const POST = isCreator(async (event) => {
	const data = await event.request.json();
	const courseId = event.params.courseId;

	return run((client) =>
		client.chapter.create({
			data: {
				...data,
				courseId
			},
			include: {
				logo: {
					select: {
						name: true
					}
				},
				course: {
					select: {
						url: true,
						name: true,
						department: {
							select: {
								url: true,
								name: true
							}
						}
					}
				}
			}
		})
	).then((chapter) => ({
		body: chapter,
		status: 201
	}));
});
