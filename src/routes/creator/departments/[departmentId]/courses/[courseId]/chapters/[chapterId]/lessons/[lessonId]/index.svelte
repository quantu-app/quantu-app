<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = await creatorGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const departmentId = input.params.departmentId;
		const courseId = input.params.courseId;
		const chapterId = input.params.chapterId;
		const lessonId = input.params.lessonId;
		const department = await showDepartmentById(departmentId, input.fetch);
		const course = await showCourseById(courseId, input.fetch);
		const chapter = await showChapterById(chapterId, input.fetch);
		const lesson = await showLessonById(lessonId, input.fetch);
		await showLessonBlocks(lessonId, input.fetch);

		return {
			props: {
				departmentId,
				courseId,
				chapterId,
				lessonId
			}
		};
	};
</script>

<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import { departmentsById, showDepartmentById } from '$lib/state/creator/departments';
	import { base } from '$app/paths';
	import { coursesById, showCourseById } from '$lib/state/creator/courses';
	import { chaptersById, showChapterById } from '$lib/state/creator/chapters';
	import { lessonsById, showLessonById } from '$lib/state/creator/lessons';
	import { lessonBlocksByLessonId, showLessonBlocks } from '$lib/state/creator/lesson-blocks';

	export let departmentId: string;
	export let courseId: string;
	export let chapterId: string;
	export let lessonId: string;

	$: department = $departmentsById[departmentId];
	$: course = $coursesById[courseId];
	$: chapter = $chaptersById[chapterId];
	$: lesson = $lessonsById[lessonId];
	$: lessonBlocks = $lessonBlocksByLessonId[lessonId] || [];
</script>

<svelte:head>
	<title>Creator Studio - {chapter.name}</title>
</svelte:head>

<StudioLayout
	breadcrumbs={[
		{
			title: 'Creator Studio',
			href: `${base}/creator`
		},
		{
			title: 'Departments',
			href: `${base}/creator`
		},
		{
			title: department.name,
			href: `${base}/creator/departments/${departmentId}`
		},
		{
			title: 'Courses',
			href: `${base}/creator/departments/${departmentId}/courses`
		},
		{
			title: course.name,
			href: `${base}/creator/departments/${departmentId}/courses/${course.id}`
		},
		{
			title: 'Chapters',
			href: `${base}/creator/departments/${departmentId}/courses/${course.id}/chapters`
		},
		{
			title: chapter.name,
			href: `${base}/creator/departments/${departmentId}/courses/${course.id}/chapters/${chapter.id}`
		},
		{
			title: 'Lessons',
			href: `${base}/creator/departments/${departmentId}/courses/${course.id}/chapters/${chapter.id}/lessons`
		},
		{
			title: lesson.name,
			href: `${base}/creator/departments/${departmentId}/courses/${course.id}/chapters/${chapter.id}/lessons/${lesson.id}`
		}
	]}
/>
