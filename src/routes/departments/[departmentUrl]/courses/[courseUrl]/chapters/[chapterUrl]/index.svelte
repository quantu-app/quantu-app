<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = await authGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const departmentUrl = input.params.departmentUrl;
		const courseUrl = input.params.courseUrl;
		const chapterUrl = input.params.chapterUrl;
		const department = await showDepartmentByUrl(departmentUrl, input.fetch);
		const course = await showCourseByUrl(departmentUrl, courseUrl, input.fetch);
		await showChapterByUrl(departmentUrl, courseUrl, chapterUrl, input.fetch);

		return {
			props: {
				departmentUrl,
				courseUrl,
				chapterUrl
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
	import { chaptersByUrl, showChapterByUrl } from '$lib/state/chapters';

	export let departmentUrl: string;
	export let courseUrl: string;
	export let chapterUrl: string;

	$: department = $departmentsByUrl[departmentUrl];
	$: course = ($coursesByUrl[departmentUrl] || {})[courseUrl];
	$: chapter = (($chaptersByUrl[departmentUrl] || {})[courseUrl] || {})[chapterUrl];
</script>

<svelte:head>
	<title>{chapter.name}</title>
</svelte:head>

<PublicLayout />
