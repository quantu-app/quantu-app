<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = (input) => {
		const response = creatorGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}

		return {
			props: {
				departmentId: input.params.departmentId
			}
		};
	};
</script>

<script lang="ts">
	import AppLayout from '$lib/components/AppLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import DepartmentComponent from '$lib/components/creator/departments/Department.svelte';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import { departmentsById, showDepartmentsById } from '$lib/state/creator/departments';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { showChallenges } from '$lib/state/creator/challenges';

	export let departmentId: string;

	$: department = $departmentsById[departmentId];

	onMount(async () => {
		const department = await showDepartmentsById(departmentId);
		showChallenges(department.id);
	});
</script>

<svelte:head>
	<title>Creator Studio</title>
</svelte:head>

<AppLayout
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
</AppLayout>
