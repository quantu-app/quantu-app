import { authGuard } from '$lib/guard/authGuard';
import { departmentCourseChapterLessonLessonBlockPath } from '$lib/routingUtils';
import { showChapterByUrl } from '$lib/state/chapters';
import { showCourseByUrl } from '$lib/state/courses';
import { showDepartmentByUrl } from '$lib/state/departments';
import { showLessonBlocks } from '$lib/state/lessonBlocks';
import { showLessonByUrl } from '$lib/state/lessons';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	await authGuard(input);

	const departmentUrl = input.params.departmentUrl;
	const courseUrl = input.params.courseUrl;
	const chapterUrl = input.params.chapterUrl;
	const lessonUrl = input.params.lessonUrl;
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
	const lessonBlocks = await showLessonBlocks(
		departmentUrl,
		courseUrl,
		chapterUrl,
		lessonUrl,
		input.fetch
	);
	const isDone = lessonBlocks.every((lessonBlock) => !!lessonBlock.result);

	if (!isDone) {
		const lessonBlock = lessonBlocks.find((lessonBlock) => !lessonBlock.result);
		if (lessonBlock) {
			throw redirect(
				302,
				departmentCourseChapterLessonLessonBlockPath(
					department.url,
					course.url,
					chapter.url,
					lesson.url,
					lessonBlock.url
				)
			);
		}
	}

	return {
		departmentUrl,
		courseUrl,
		chapterUrl,
		lessonUrl
	};
};
