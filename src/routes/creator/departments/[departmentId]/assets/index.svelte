<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = creatorGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const departmentId = input.params.departmentId;
		const department = await showDepartmentById(departmentId, input.fetch);
		showChallenges(department.id, input.fetch);

		return {
			props: {
				departmentId
			}
		};
	};
</script>

<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import Assets from '$lib/components/creator/assets/Assets.svelte';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import { departmentsById, showDepartmentById } from '$lib/state/creator/departments';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { showChallenges } from '$lib/state/creator/challenges';

	export let departmentId: string;

	$: department = $departmentsById[departmentId];

	onMount(async () => {
		const department = await showDepartmentById(departmentId);
		showChallenges(department.id);
	});
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
			title: department?.name,
			href: `${base}/creator/departments/${departmentId}`
		},
		{
			title: 'Assets',
			href: `${base}/creator/departments/${departmentId}/assets`
		}
	]}
>
	<Assets {departmentId} />
</StudioLayout>
