import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const get = isCreator((event) => {
	const courseId = event.params.courseId;

	return run((client) =>
		client.course.findMany({
			where: {
				id: courseId
			},
			include: {
				department: {
					select: {
						url: true,
						name: true
					}
				}
			}
		})
	).then((courses) => ({
		body: courses,
		status: 200
	}));
});

export const post = isCreator(async (event) => {
	const data = await event.request.json();
	const courseId = event.params.courseId;

	return run((client) =>
		client.course.create({
			data: {
				...data,
				id: courseId
			},
			include: {
				department: {
					select: {
						url: true,
						name: true
					}
				}
			}
		})
	).then((course) => ({
		body: course,
		status: 201
	}));
});
