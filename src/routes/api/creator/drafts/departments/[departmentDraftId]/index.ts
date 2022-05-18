import { isCreator } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const get = isCreator((event) => {
	const departmentDraftId = event.params.departmentDraftId;

	return run((client) =>
		client.departmentDraft.findUnique({
			where: {
				id: departmentDraftId
			},
			include: {
				approvals: true,
				user: {
					select: {
						id: true,
						username: true
					}
				},
				logo: {
					select: {
						name: true
					}
				},
				departmentRef: {
					select: {
						id: true,
						name: true,
						url: true
					}
				}
			}
		})
	).then((departmentDraft) => ({
		body: departmentDraft,
		status: departmentDraft ? 200 : 404
	}));
});

export const patch = isCreator(async (event) => {
	const data = await event.request.json();
	const departmentDraftId = event.params.departmentDraftId;

	return run((client) =>
		client.departmentDraft.update({
			where: {
				id: departmentDraftId
			},
			include: {
				approvals: true,
				user: {
					select: {
						id: true,
						username: true
					}
				},
				logo: {
					select: {
						name: true
					}
				},
				departmentRef: {
					select: {
						id: true,
						name: true,
						url: true
					}
				}
			},
			data
		})
	).then((departmentDraft) => ({
		body: departmentDraft,
		status: departmentDraft ? 200 : 400
	}));
});

export const del = isCreator((event) => {
	const departmentDraftId = event.params.departmentDraftId;

	return run((client) =>
		client.departmentDraft.delete({
			where: {
				id: departmentDraftId
			},
			include: {
				approvals: true,
				user: {
					select: {
						id: true,
						username: true
					}
				},
				logo: {
					select: {
						name: true
					}
				},
				departmentRef: {
					select: {
						id: true,
						name: true,
						url: true
					}
				}
			}
		})
	).then((departmentDraft) => ({
		body: departmentDraft,
		status: 200
	}));
});
