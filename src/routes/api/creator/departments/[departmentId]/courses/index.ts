import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const GET = isCreator((event) => {
	const departmentId = event.params.departmentId;

	return run((client) =>
		client.course.findMany({
			where: {
				departmentId
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

export const POST = isCreator(async (event) => {
	const data = await event.request.json();
	const departmentId = event.params.departmentId;

	return run((client) =>
		client.course.create({
			data: {
				...data,
				departmentId
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
