import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const get = isCreator((event) => {
	const courseId = event.params.courseId;

	return run((client) =>
		client.course.findFirst({
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
	).then((course) => ({
		body: course,
		status: 200
	}));
});

export const patch = isCreator(async (event) => {
	const data = await event.request.json();
	const courseId = event.params.courseId;

	return run((client) =>
		client.course.update({
			where: {
				id: courseId
			},
			data,
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
		status: 200
	}));
});

export const del = isCreator((event) => {
	const courseId = event.params.courseId;

	return run((client) =>
		client.course.delete({
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
	).then((course) => ({
		body: course,
		status: 200
	}));
});
