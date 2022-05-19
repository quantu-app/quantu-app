<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = creatorGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const departmentChangeId = input.params.departmentChangeId;
		await showDepartmentChangeById(departmentChangeId, input.fetch);

		return {
			props: {
				departmentChangeId
			}
		};
	};
</script>

<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import DepartmentChange from '$lib/components/creator/departments/DepartmentChange.svelte';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import {
		departmentChangesById,
		showDepartmentChangeById
	} from '$lib/state/creator/departmentChanges';
	import { base } from '$app/paths';

	export let departmentChangeId: string;

	$: departmentChange = $departmentChangesById[departmentChangeId];
</script>

<svelte:head>
	<title>Creator Studio</title>
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
			title: 'Department Changes',
			href: `${base}/creator/departments/changes`
		},
		{
			title: departmentChange.name,
			href: `${base}/creator/department/changes/${departmentChangeId}`
		}
	]}
>
	<DepartmentChange {departmentChange} />
</StudioLayout>
