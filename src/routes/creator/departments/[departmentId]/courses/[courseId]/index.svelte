<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = await creatorGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const departmentId = input.params.departmentId;
		const courseId = input.params.courseId;
		await showDepartmentById(departmentId, input.fetch);
		await showCourseById(courseId, input.fetch);
		await showChapters(courseId, input.fetch);

		return {
			props: {
				departmentId,
				courseId
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
	import { showCourseById, coursesById } from '$lib/state/creator/courses';
	import Course from '$lib/components/creator/courses/Course.svelte';
	import { showChapters, chaptersByCourseId } from '$lib/state/creator/chapters';

	export let departmentId: string;
	export let courseId: string;

	$: department = $departmentsById[departmentId];
	$: course = $coursesById[courseId];
	$: chapters = $chaptersByCourseId[courseId] || [];
</script>

<svelte:head>
	<title>Course Editor | {course.name}</title>
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
		}
	]}
>
	<Course {department} {course} {chapters} />
</StudioLayout>
