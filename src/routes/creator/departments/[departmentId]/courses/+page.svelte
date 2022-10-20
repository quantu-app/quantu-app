<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';

	import { departmentsById, showDepartmentById } from '$lib/state/creator/departments';
	import { base } from '$app/paths';
	import { showCourses, coursesByDepartmentId } from '$lib/state/creator/courses';
	import Courses from '$lib/components/creator/courses/Courses.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ departmentId } = data);

	$: department = $departmentsById[departmentId];
	$: courses = $coursesByDepartmentId[department.id] || [];
</script>

<svelte:head>
	<title>Creator Studio - Courses</title>
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
		}
	]}
>
	<Courses {department} {courses} />
</StudioLayout>
