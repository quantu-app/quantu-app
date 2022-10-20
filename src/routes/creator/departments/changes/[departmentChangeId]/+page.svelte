<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import DepartmentChange from '$lib/components/creator/departments/DepartmentChange.svelte';

	import { changesById, showChangeById } from '$lib/state/creator/changes';
	import { base } from '$app/paths';
	import { departmentsById, showDepartmentById } from '$lib/state/creator/departments';
	import {
		showMergeRequestByChangeId,
		mergeRequestsByChangeId
	} from '$lib/state/creator/mergeRequests';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ departmentChangeId } = data);

	$: departmentChange = $changesById[departmentChangeId];
	$: department = departmentChange.referenceId
		? $departmentsById[departmentChange.referenceId]
		: undefined;
	$: mergeRequest = $mergeRequestsByChangeId[departmentChange.id];
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
			title: 'Changes',
			href: `${base}/creator/departments/changes`
		},
		{
			title: departmentChange.name,
			href: `${base}/creator/departments/changes/${departmentChangeId}`
		}
	]}
>
	<DepartmentChange {departmentChange} {department} {mergeRequest} />
</StudioLayout>
