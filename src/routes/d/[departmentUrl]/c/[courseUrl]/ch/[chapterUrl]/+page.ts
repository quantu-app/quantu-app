import { authGuard } from '$lib/guard/authGuard';
import { showChapterByUrl } from '$lib/state/chapters';
import { showCourseByUrl } from '$lib/state/courses';
import { showDepartmentByUrl } from '$lib/state/departments';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	await authGuard(input);

	const departmentUrl = input.params.departmentUrl;
	const courseUrl = input.params.courseUrl;
	const chapterUrl = input.params.chapterUrl;
	const department = await showDepartmentByUrl(departmentUrl, input.fetch);
	const course = await showCourseByUrl(departmentUrl, courseUrl, input.fetch);
	await showChapterByUrl(departmentUrl, courseUrl, chapterUrl, input.fetch);

	return {
		departmentUrl,
		courseUrl,
		chapterUrl
	};
};
