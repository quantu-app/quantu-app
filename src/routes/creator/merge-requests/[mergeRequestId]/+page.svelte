<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import MergeRequest from '$lib/components/creator/mergeRequests/MergeRequest.svelte';

	import { changesById, showChangeAt, showChangeById } from '$lib/state/creator/changes';
	import { base } from '$app/paths';
	import { showMergeRequestById, mergeRequestsById } from '$lib/state/creator/mergeRequests';
	import type { Prisma } from '@prisma/client';

	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ mergeRequestId, prevChangeValue } = data);

	$: mergeRequest = $mergeRequestsById[mergeRequestId];
	$: change = $changesById[mergeRequest.changeId];
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
			title: 'Merge Requests',
			href: `${base}/creator/merge-requests`
		},
		{
			title: change.name,
			href: `${base}/creator/merge-requests/${mergeRequestId}`
		}
	]}
>
	<MergeRequest {change} {mergeRequest} {prevChangeValue} />
</StudioLayout>
