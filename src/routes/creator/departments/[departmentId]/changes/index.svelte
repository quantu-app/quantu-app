<script context="module" lang="ts">
	export const load: Load = async (input) => {
		const response = await creatorGuard(input);
		if (!isValidStatus(response)) {
			return response;
		}

		const departmentId = input.params.departmentId;
		const changes = await showChanges('CHANGE', undefined, false, true, undefined, input.fetch);
		await showCourses(
			departmentId,
			changes
				.map((change) => change.referenceId)
				.filter((referenceId) => !!referenceId) as string[],
			input.fetch
		);
		return response;
	};
</script>

<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import CourseChanges from '$lib/components/creator/courses/CourseChanges.svelte';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import type { Load } from '@sveltejs/kit';
	import { changes, showChanges } from '$lib/state/creator/changes';
	import { base } from '$app/paths';
	import { showCourses } from '$lib/state/creator/courses';
</script>

<svelte:head>
	<title>Creator Studio - Course Changes</title>
</svelte:head>

<StudioLayout
	breadcrumbs={[
		{
			title: 'Creator Studio',
			href: `${base}/creator`
		},
		{
			title: 'Courses',
			href: `${base}/creator`
		},
		{
			title: 'Changes',
			href: `${base}/creator/courses/changes`
		}
	]}
>
	<CourseChanges courseChanges={$changes} />
</StudioLayout>
