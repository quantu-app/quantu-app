<svelte:options immutable />

<script lang="ts">
	import type { StateMergeRequest } from '$lib/state/creator/mergeRequests';
	import MergeRequestList from './MergeRequestList.svelte';

	export let mergeRequests: StateMergeRequest[];
</script>

<div class="container mb-8">
	<MergeRequestList {mergeRequests} />
</div>
