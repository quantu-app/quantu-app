<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = await creatorGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const mergeRequestId = input.params.mergeRequestId;
		const mergeRequest = await showMergeRequestById(mergeRequestId, input.fetch);
		await showChangeById(mergeRequest.changeId, input.fetch);
		const prevChangeValue = mergeRequest.change.prevChangeId
			? await showChangeAt(mergeRequest.change.prevChangeId, input.fetch)
			: null;

		return {
			props: {
				mergeRequestId,
				prevChangeValue
			}
		};
	};
</script>

<script lang="ts">
	import StudioLayout from '$lib/components/layouts/StudioLayout.svelte';
	import { creatorGuard } from '$lib/guard/creatorGuard';
	import MergeRequest from '$lib/components/creator/mergeRequests/MergeRequest.svelte';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import { changesById, showChangeAt, showChangeById } from '$lib/state/creator/changes';
	import { base } from '$app/paths';
	import { showMergeRequestById, mergeRequestsById } from '$lib/state/creator/mergeRequests';
	import type { Prisma } from '@prisma/client';

	export let mergeRequestId: string;
	export let prevChangeValue: Prisma.JsonObject | null;

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
