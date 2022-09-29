import { authGuard } from '$lib/guard/authGuard';
import { showChapterByUrl } from '$lib/state/chapters';
import { showCourseByUrl } from '$lib/state/courses';
import { showDepartmentByUrl } from '$lib/state/departments';
import { showLessonBlocks } from '$lib/state/lessonBlocks';
import { showLessonByUrl } from '$lib/state/lessons';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	await authGuard(input);

	const departmentUrl = input.params.departmentUrl;
	const courseUrl = input.params.courseUrl;
	const chapterUrl = input.params.chapterUrl;
	const lessonUrl = input.params.lessonUrl;
	const lessonBlockUrl = input.params.lessonBlockUrl;
	const department = await showDepartmentByUrl(departmentUrl, input.fetch);
	const course = await showCourseByUrl(departmentUrl, courseUrl, input.fetch);
	const chapter = await showChapterByUrl(departmentUrl, courseUrl, chapterUrl, input.fetch);
	const lesson = await showLessonByUrl(
		departmentUrl,
		courseUrl,
		chapterUrl,
		lessonUrl,
		input.fetch
	);
	await showLessonBlocks(departmentUrl, courseUrl, chapterUrl, lessonUrl, input.fetch);

	return {
		departmentUrl,
		courseUrl,
		chapterUrl,
		lessonUrl,
		lessonBlockUrl
	};
};
