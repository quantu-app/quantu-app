<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = creatorGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const departmentDraftId = input.params.departmentDraftId;
		await showDepartmentDraftById(departmentDraftId, input.fetch);

		return {
			props: {
				departmentDraftId
			}
		};
	};
</script>

<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import DepartmentDraft from '$lib/components/creator/departments/DepartmentDraft.svelte';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import {
		departmentDraftsById,
		showDepartmentDraftById
	} from '$lib/state/creator/departmentDrafts';
	import { base } from '$app/paths';

	export let departmentDraftId: string;

	$: departmentDraft = $departmentDraftsById[departmentDraftId];
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
			title: 'Department Drafts',
			href: `${base}/creator/departments/drafts`
		},
		{
			title: departmentDraft?.name,
			href: `${base}/creator/department/drafts/${departmentDraftId}`
		}
	]}
>
	{#if departmentDraft}
		<DepartmentDraft {departmentDraft} />
	{/if}
</StudioLayout>
