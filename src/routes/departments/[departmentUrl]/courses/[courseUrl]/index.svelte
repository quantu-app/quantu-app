<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = await authGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const departmentUrl = input.params.departmentUrl;
		const courseUrl = input.params.courseUrl;
		const department = await showDepartmentByUrl(departmentUrl, input.fetch);
		await showCourseByUrl(departmentUrl, courseUrl, input.fetch);

		return {
			props: {
				departmentUrl,
				courseUrl
			}
		};
	};
</script>

<script lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import { departmentsByUrl, showDepartmentByUrl } from '$lib/state/departments';
	import { showCourseByUrl, coursesByUrl } from '$lib/state/courses';
	import PublicLayout from '$lib/components/layouts/PublicLayout.svelte';

	export let departmentUrl: string;

	$: department = $departmentsByUrl[departmentUrl];
	$: course = $coursesByUrl[department.id] || [];
</script>

<svelte:head>
	<title>{course.name}</title>
</svelte:head>

<PublicLayout />
