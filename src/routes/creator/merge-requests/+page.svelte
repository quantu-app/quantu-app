<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import MergeRequests from '$lib/components/creator/mergeRequests/MergeRequests.svelte';

	import type { Load } from '@sveltejs/kit';
	import { base } from '$app/paths';
	import { showMergeRequests, mergeRequests } from '$lib/state/creator/mergeRequests';
	import { showChangesByIds } from '$lib/state/creator/changes';
</script>

<svelte:head>
	<title>Creator Studio - Merge Requests</title>
</svelte:head>

<StudioLayout
	breadcrumbs={[
		{
			title: 'Creator Studio',
			href: `${base}/creator`
		},
		{
			title: 'Merge Requests',
			href: `${base}/creator/merge-requests`
		}
	]}
>
	<MergeRequests mergeRequests={$mergeRequests} />
</StudioLayout>
