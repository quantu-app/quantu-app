<script lang="ts">
	import { authGuard } from '$lib/guard/authGuard';

	import { departmentsByUrl, showDepartmentByUrl } from '$lib/state/departments';
	import { coursesByUrl, showCourseByUrl } from '$lib/state/courses';
	import { showChapterByUrl } from '$lib/state/chapters';
	import { lessonsByUrl, showLessonByUrl } from '$lib/state/lessons';
	import { lessonBlocksByUrl, showLessonBlocks } from '$lib/state/lessonBlocks';
	import LessonLayout from '$lib/components/layouts/LessonLayout.svelte';
	import {
		departmentCoursePath,
		departmentCourseChapterLessonLessonBlockPath
	} from '$lib/routingUtils';
	import { sortByIndex } from '$lib/utils';
	import LessonComplete from '$lib/components/lessons/LessonComplete.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ departmentUrl, courseUrl, chapterUrl, lessonUrl } = data);

	$: department = $departmentsByUrl[departmentUrl];
	$: course = ($coursesByUrl[departmentUrl] || {})[courseUrl];
	$: lesson = ((($lessonsByUrl[departmentUrl] || {})[courseUrl] || {})[chapterUrl] || {})[
		lessonUrl
	];
	$: lessonBlocks = Object.values(
		((($lessonBlocksByUrl[departmentUrl] || {})[courseUrl] || {})[chapterUrl] || {})[lessonUrl] ||
			{}
	).sort(sortByIndex);
</script>

<svelte:head>
	<title>Lesson | {lesson.name}</title>
</svelte:head>

<LessonLayout
	returnRoute={departmentCoursePath(department.url, course.url)}
	lessonName={lesson.name}
>
	<LessonComplete
		{lesson}
		{lessonBlocks}
		continueLink={departmentCoursePath(department.url, course.url)}
	/>
</LessonLayout>
