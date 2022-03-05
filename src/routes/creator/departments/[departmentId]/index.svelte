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
	import { browser } from '$app/env';
	import { base } from '$app/paths';

	export let departmentId: string;

	$: department = $departmentsById[departmentId];

	if (browser) {
		showDepartmentsById(departmentId);
	}
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
