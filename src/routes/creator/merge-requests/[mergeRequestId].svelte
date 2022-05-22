<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = creatorGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const mergeRequestId = input.params.mergeRequestId;
		const mergeRequest = await showMergeRequestById(mergeRequestId, input.fetch);
		await showChangeById(mergeRequest.changeId, input.fetch);

		return {
			props: {
				mergeRequestId
			}
		};
	};
</script>

<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import MergeRequest from '$lib/components/creator/mergeRequests/MergeRequest.svelte';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import { changesById, showChangeById } from '$lib/state/creator/changes';
	import { base } from '$app/paths';
	import { showMergeRequestById, mergeRequestsById } from '$lib/state/creator/mergeRequests';

	export let mergeRequestId: string;

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
			title: mergeRequest.reference?.name || change.value['name'],
			href: `${base}/creator/merge-requests/${mergeRequestId}`
		}
	]}
>
	<MergeRequest {change} {mergeRequest} />
</StudioLayout>
