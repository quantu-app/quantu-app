import { creatorGuard } from '$lib/guard/creatorGuard';
import { showChangeById } from '$lib/state/creator/changes';
import { showDepartmentById } from '$lib/state/creator/departments';
import { showMergeRequestByChangeId } from '$lib/state/creator/mergeRequests';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	await creatorGuard(input);

	const departmentChangeId = input.params.departmentChangeId;
	const change = await showChangeById(departmentChangeId, input.fetch);
	if (change.referenceId) {
		await showDepartmentById(change.referenceId, input.fetch);
	}
	await showMergeRequestByChangeId(departmentChangeId, input.fetch).catch(() => {});

	return {
		departmentChangeId
	};
};
