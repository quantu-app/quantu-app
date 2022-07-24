import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const GET = isCreator((event) => {
	const courseId = event.params.courseId;

	return run((client) =>
		client.course.findFirst({
			where: {
				id: courseId
			},
			include: {
				logo: {
					select: {
						name: true
					}
				},
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

export const PATCH = isCreator(async (event) => {
	const data = await event.request.json();
	const courseId = event.params.courseId;

	return run((client) =>
		client.course.update({
			where: {
				id: courseId
			},
			data,
			include: {
				logo: {
					select: {
						name: true
					}
				},
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

export const DELETE = isCreator((event) => {
	const courseId = event.params.courseId;

	return run((client) =>
		client.course.delete({
			where: {
				id: courseId
			},
			include: {
				logo: {
					select: {
						name: true
					}
				},
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
