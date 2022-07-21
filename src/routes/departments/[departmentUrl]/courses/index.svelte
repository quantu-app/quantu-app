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
	import PublicLayout from '$lib/components/layouts/PublicLayout.svelte';
	import { authGuard } from '$lib/guard/authGuard';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import { departmentsByUrl, showDepartmentByUrl } from '$lib/state/departments';
	import { showCourses, coursesByUrl } from '$lib/state/courses';

	export let departmentUrl: string;

	$: department = $departmentsByUrl[departmentUrl];
	$: courses = $coursesByUrl[departmentUrl] || [];
</script>

<svelte:head>
	<title>Courses</title>
</svelte:head>

<PublicLayout />
