<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import DepartmentCoursesMain from '$lib/components/courses/DepartmentCoursesMain.svelte';
	import { authGuard } from '$lib/guard/authGuard';

	import { departmentsByUrl, showDepartmentByUrl } from '$lib/state/departments';
	import { courses as coursesState, showCourses, coursesByUrl } from '$lib/state/courses';
	import { sortByCreatedAt } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ departmentUrl } = data);

	$: department = $departmentsByUrl[departmentUrl];
	$: courses = $coursesByUrl[departmentUrl] || [];
	$: newestCourses = $coursesState.sort(sortByCreatedAt).slice(0, 4);
</script>

<svelte:head>
	<title>{department.name} | Courses</title>
</svelte:head>

<UserLayout>
	<DepartmentCoursesMain {newestCourses} {courses} />
</UserLayout>
