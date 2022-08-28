<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = await creatorGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const departmentChangeId = input.params.departmentChangeId;
		const change = await showChangeById(departmentChangeId, input.fetch);
		if (change.referenceId) {
			await showDepartmentById(change.referenceId, input.fetch);
		}
		await showMergeRequestByChangeId(departmentChangeId, input.fetch).catch((error) => {
			console.error(error);
		});

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
	import { changesById, showChangeById } from '$lib/state/creator/changes';
	import { base } from '$app/paths';
	import { departmentsById, showDepartmentById } from '$lib/state/creator/departments';
	import {
		showMergeRequestByChangeId,
		mergeRequestsByChangeId
	} from '$lib/state/creator/mergeRequests';

	export let departmentChangeId: string;

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
