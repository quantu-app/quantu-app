<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = await authGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const departmentUrl = input.params.departmentUrl;
		const department = await showDepartmentByUrl(departmentUrl, input.fetch);
		await showCourses(departmentUrl, input.fetch);

		return {
			props: {
				departmentUrl
			}
		};
	};
</script>

<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import DepartmentCoursesMain from '$lib/components/courses/DepartmentCoursesMain.svelte';
	import { authGuard } from '$lib/guard/authGuard';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import { departmentsByUrl, showDepartmentByUrl } from '$lib/state/departments';
	import { courses as coursesState, showCourses, coursesByUrl } from '$lib/state/courses';
	import { sortByCreatedAt } from '$lib/utils';

	export let departmentUrl: string;

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
