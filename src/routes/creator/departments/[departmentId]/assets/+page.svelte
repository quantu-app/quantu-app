<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import Assets from '$lib/components/creator/assets/Assets.svelte';

	import { departmentsById, showDepartmentById } from '$lib/state/creator/departments';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { showChallenges } from '$lib/state/creator/challenges';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ departmentId } = data);

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
