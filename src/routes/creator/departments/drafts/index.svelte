<script context="module" lang="ts">
	export const load: Load = async (input) => {
		const response = creatorGuard(input);
		if (!isValidStatus(response)) {
			return response;
		}
		await showDepartmentDrafts(false, input.fetch);
		return response;
	};
</script>

<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import DepartmentDrafts from '$lib/components/creator/departments/DepartmentDrafts.svelte';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import type { Load } from '@sveltejs/kit';
	import { departmentDrafts, showDepartmentDrafts } from '$lib/state/creator/departmentDrafts';
	import { base } from '$app/paths';

	$: mergedDepartmentDrafts = $departmentDrafts.filter(
		(departmentDraft) => departmentDraft.merged === false
	);
</script>

<svelte:head>
	<title>Creator Studio - Department Drafts</title>
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
			title: 'Drafts',
			href: `${base}/creator/departments/drafts`
		}
	]}
>
	<DepartmentDrafts departmentDrafts={mergedDepartmentDrafts} />
</StudioLayout>
