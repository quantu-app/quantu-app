<svelte:options immutable />

<script lang="ts">
	import MergeRequestListItem from './MergeRequestListItem.svelte';
	import type { StateMergeRequest } from '$lib/state/creator/mergeRequests';

	export let mergeRequests: StateMergeRequest[];
</script>

<div class="container p-0">
	<div class="row">
		{#each mergeRequests as mergeRequest (mergeRequest.id)}
			<MergeRequestListItem {mergeRequest} />
		{/each}
	</div>
</div>
