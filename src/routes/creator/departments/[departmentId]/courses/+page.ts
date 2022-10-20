import { creatorGuard } from '$lib/guard/creatorGuard';
import { showCourses } from '$lib/state/creator/courses';
import { showDepartmentById } from '$lib/state/creator/departments';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	await creatorGuard(input);

	const departmentId = input.params.departmentId;
	const department = await showDepartmentById(departmentId, input.fetch);
	await showCourses(department.id, [], input.fetch);

	return {
		departmentId
	};
};
