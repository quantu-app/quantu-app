import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const GET = isCreator((event) => {
	const departmentId = event.params.departmentId;

	return run((client) =>
		client.department.findUnique({
			where: {
				id: departmentId
			},
			include: {
				logo: {
					select: {
						name: true
					}
				}
			}
		})
	).then(
		(department) => new Response(JSON.stringify(department), { status: department ? 200 : 404 })
	);
});

export const PATCH = isCreator(async (event) => {
	const data = await event.request.json();
	const departmentId = event.params.departmentId;

	return run((client) =>
		client.department.update({
			where: {
				id: departmentId
			},
			include: {
				logo: {
					select: {
						name: true
					}
				}
			},
			data
		})
	).then(
		(department) => new Response(JSON.stringify(department), { status: department ? 200 : 400 })
	);
});
