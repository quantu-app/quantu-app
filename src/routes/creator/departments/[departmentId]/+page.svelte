<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import Department from '$lib/components/creator/departments/Department.svelte';

	import { departmentsById, showDepartmentById } from '$lib/state/creator/departments';
	import { base } from '$app/paths';
	import { showChallenges, challengesByDepartmentId } from '$lib/state/creator/challenges';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ departmentId } = data);

	$: department = $departmentsById[departmentId];
	$: challenges = $challengesByDepartmentId[department.id] || [];
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
		}
	]}
>
	<Department {department} {challenges} />
</StudioLayout>
