<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = creatorGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const departmentId = input.params.departmentId;
		const department = await showDepartmentsById(departmentId, input.fetch);
		await showChallenges(department.id, input.fetch);

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
	import DepartmentComponent from '$lib/components/creator/departments/Department.svelte';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import { departmentsById, showDepartmentsById } from '$lib/state/creator/departments';
	import { base } from '$app/paths';
	import { showChallenges } from '$lib/state/creator/challenges';

	export let departmentId: string;

	$: department = $departmentsById[departmentId];
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
			title: 'Departments'
		},
		{
			title: department?.name,
			href: `${base}/creator/departments/${departmentId}`
		}
	]}
>
	{#if department}
		<DepartmentComponent {department} />
	{/if}
</StudioLayout>
