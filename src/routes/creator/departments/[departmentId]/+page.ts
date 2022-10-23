import { creatorGuard } from '$lib/guard/creatorGuard';
import { showChallenges } from '$lib/state/creator/challenges';
import { showDepartmentById } from '$lib/state/creator/departments';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	await creatorGuard(input);

	const departmentId = parseInt(input.params.departmentId);
	const department = await showDepartmentById(departmentId, input.fetch);
	await showChallenges(department.id, input.fetch);

	return {
		departmentId
	};
};
