<script context="module" lang="ts">
	export const load: Load = async (input) => {
		const response = creatorGuard(input);
		if (!isValidStatus(response)) {
			return response;
		}
		const changes = await showChanges('DEPARTMENT', null, false, true, false, input.fetch);
		await showDepartments(
			changes.map((change) => change.referenceId).filter((referenceId) => !!referenceId),
			input.fetch
		);
		return response;
	};
</script>

<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import DepartmentChanges from '$lib/components/creator/departments/DepartmentChanges.svelte';
	import { isValidStatus } from '$lib/guard/isValidStatus';
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
