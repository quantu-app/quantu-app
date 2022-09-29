import { creatorGuard } from '$lib/guard/creatorGuard';
import { showChapters } from '$lib/state/creator/chapters';
import { showCourseById } from '$lib/state/creator/courses';
import { showDepartmentById } from '$lib/state/creator/departments';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	await creatorGuard(input);

	const departmentId = input.params.departmentId;
	const courseId = input.params.courseId;
	await showDepartmentById(departmentId, input.fetch);
	await showCourseById(courseId, input.fetch);
	await showChapters(courseId, input.fetch);

	return {
		departmentId,
		courseId
	};
};
