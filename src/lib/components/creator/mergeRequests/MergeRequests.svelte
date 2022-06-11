<svelte:options immutable />

<script lang="ts" context="module">
	const merged = writable(false);
</script>

<script lang="ts">
	import type { StateMergeRequest } from '$lib/state/creator/mergeRequests';
	import { writable } from 'svelte/store';
	import MergeRequestList from './MergeRequestList.svelte';

	export let mergeRequests: StateMergeRequest[];

	$: filteredMergeRequests = mergeRequests.filter(
		(mergeRequest) => mergeRequest.merged === $merged
	);
</script>

<div class="container mb-2">
	<div class="d-flex">
		<div class="form-check">
			<input
				class="form-check-input"
				type="checkbox"
				bind:value={$merged}
				bind:checked={$merged}
				id="merged-check"
			/>
			<label class="form-check-label" for="merged-check">Merged?</label>
		</div>
	</div>
</div>
<div class="container mb-8">
	<MergeRequestList mergeRequests={filteredMergeRequests} />
</div>
