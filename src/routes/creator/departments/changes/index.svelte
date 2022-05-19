<script context="module" lang="ts">
	export const load: Load = async (input) => {
		const response = creatorGuard(input);
		if (!isValidStatus(response)) {
			return response;
		}
		await showDepartmentChanges(input.fetch);
		return response;
	};
</script>

<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import DepartmentChanges from '$lib/components/creator/departments/DepartmentChanges.svelte';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import type { Load } from '@sveltejs/kit';
	import { departmentChanges, showDepartmentChanges } from '$lib/state/creator/departmentChanges';
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>Creator Studio - Department Changes</title>
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
			title: 'Changes',
			href: `${base}/creator/departments/changes`
		}
	]}
>
	<DepartmentChanges departmentChanges={$departmentChanges} />
</StudioLayout>
