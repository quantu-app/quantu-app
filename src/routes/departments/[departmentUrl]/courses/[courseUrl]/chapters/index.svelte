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
		const course = await showCourseByUrl(departmentUrl, courseUrl, input.fetch);
		await showChapters(departmentUrl, courseUrl, input.fetch);

		return {
			props: {
				departmentUrl,
				courseUrl
			}
		};
	};
</script>

<script lang="ts">
	import PublicLayout from '$lib/components/layouts/PublicLayout.svelte';
	import { authGuard } from '$lib/guard/authGuard';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import { departmentsByUrl, showDepartmentByUrl } from '$lib/state/departments';
	import { coursesByUrl, showCourseByUrl } from '$lib/state/courses';
	import { chaptersByUrl, showChapters } from '$lib/state/chapters';

	export let departmentUrl: string;
	export let courseUrl: string;

	$: department = $departmentsByUrl[departmentUrl];
	$: course = ($coursesByUrl[departmentUrl] || {})[courseUrl];
	$: chapters = Object.values(($chaptersByUrl[departmentUrl] || {})[courseUrl] || {});
</script>

<svelte:head>
	<title>Chapters</title>
</svelte:head>

<PublicLayout />
