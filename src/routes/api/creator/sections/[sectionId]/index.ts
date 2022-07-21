import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';
import type { PrismaClient } from '@prisma/client';

export const GET = isCreator((event) => {
	const sectionId = event.params.sectionId;

	return run((client) =>
		client.section.findFirst({
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
	).then((section) => ({
		body: section,
		status: 200
	}));
});

export const PATCH = isCreator(async (event) =>
	run(async (client) =>
		updateSection(client, event.params.sectionId, await event.request.json())
	).then((section) => ({
		body: section,
		status: 200
	}))
);

export async function updateSection(client: PrismaClient, sectionId: string, data: any) {
	delete data.index;
	return client.section.update({
		where: {
			id: sectionId
		},
		data,
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
	});
}

export const DELETE = isCreator((event) => {
	const sectionId = event.params.sectionId;

	return run((client) =>
		client.section.delete({
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
	).then((section) => ({
		body: section,
		status: 200
	}));
});
