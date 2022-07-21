import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const GET = isCreator((event) => {
	const sectionId = event.params.sectionId;

	return run((client) =>
		client.section.findMany({
			where: {
				id: sectionId
			},
			include: {
				lesson: {
					select: {
						url: true,
						name: true,
						chapter: {
							select: {
								url: true,
								name: true,
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
						}
					}
				}
			}
		})
	).then((sections) => ({
		body: sections,
		status: 200
	}));
});

export const POST = isCreator(async (event) => {
	const data = await event.request.json();
	const sectionId = event.params.sectionId;

	return run((client) =>
		client.section.create({
			data: {
				...data,
				id: sectionId
			},
			include: {
				lesson: {
					select: {
						url: true,
						name: true,
						chapter: {
							select: {
								url: true,
								name: true,
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
						}
					}
				}
			}
		})
	).then((section) => ({
		body: section,
		status: 201
	}));
});
