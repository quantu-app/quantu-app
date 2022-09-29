import { authGuard } from '$lib/guard/authGuard';
import { showCourses } from '$lib/state/courses';
import { showDepartmentByUrl } from '$lib/state/departments';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	await authGuard(input);

	const departmentUrl = input.params.departmentUrl;
	await showDepartmentByUrl(departmentUrl, input.fetch);
	await showCourses(departmentUrl, input.fetch);

	return {
		departmentUrl
	};
};
