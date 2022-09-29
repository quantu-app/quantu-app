import { authGuard } from '$lib/guard/authGuard';
import { showChallenges } from '$lib/state/challenges';
import { showDepartmentByUrl } from '$lib/state/departments';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	await authGuard(input);

	const departmentUrl = input.params.departmentUrl;
	const department = await showDepartmentByUrl(departmentUrl, input.fetch);
	await showChallenges(departmentUrl, input.fetch);

	return {
		departmentUrl
	};
};
