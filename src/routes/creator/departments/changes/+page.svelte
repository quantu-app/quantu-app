<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import DepartmentChanges from '$lib/components/creator/departments/DepartmentChanges.svelte';

	import type { Load } from '@sveltejs/kit';
	import { changes, showChanges } from '$lib/state/creator/changes';
	import { base } from '$app/paths';
	import { showDepartments } from '$lib/state/creator/departments';
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
	<DepartmentChanges departmentChanges={$changes} />
</StudioLayout>
