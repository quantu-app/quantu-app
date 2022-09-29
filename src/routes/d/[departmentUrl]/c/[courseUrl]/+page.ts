import { authGuard } from '$lib/guard/authGuard';
import { showChapters } from '$lib/state/chapters';
import { showCourseByUrl } from '$lib/state/courses';
import { showDepartmentByUrl } from '$lib/state/departments';
import { showLessons } from '$lib/state/lessons';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	await authGuard(input);

	const departmentUrl = input.params.departmentUrl;
	const courseUrl = input.params.courseUrl;
	await showDepartmentByUrl(departmentUrl, input.fetch);
	await showCourseByUrl(departmentUrl, courseUrl, input.fetch);
	const chapters = await showChapters(departmentUrl, courseUrl, input.fetch);
	await Promise.all(
		chapters.map((chapter) => showLessons(departmentUrl, courseUrl, chapter.url, input.fetch))
	);

	return {
		departmentUrl,
		courseUrl
	};
};
