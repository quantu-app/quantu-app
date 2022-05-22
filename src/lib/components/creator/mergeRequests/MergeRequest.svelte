<svelte:options immutable />

<script lang="ts">
	import type { StateChange } from '$lib/state/creator/changes';
	import { mergeMergeRequest, type StateMergeRequest } from '$lib/state/creator/mergeRequests';
	import Change from './Change.svelte';

	export let mergeRequest: StateMergeRequest;
	export let change: StateChange;

	$: value = Object.assign({}, mergeRequest.reference, change.value);

	let merging = false;
	async function onMerge() {
		merging = true;
		try {
			await mergeMergeRequest(mergeRequest.id);
		} finally {
			merging = false;
		}
	}
</script>

<div class="container">
	<div class="d-flex justify-content-end">
		<button class="btn btn-primary" disabled={mergeRequest.merged || merging} on:click={onMerge}>
			{#if mergeRequest.merged}
				Merged
			{:else}
				Merge
			{/if}
		</button>
	</div>
</div>
<div class="container mb-8">
	<div class="row">
		{#if mergeRequest.reference}
			<div class="col">
				<h1>Old</h1>
				<Change
					referenceType={mergeRequest.change.referenceType}
					reference={mergeRequest.reference}
				/>
			</div>
		{/if}
		<div class="col">
			<h1>New</h1>
			<Change referenceType={mergeRequest.change.referenceType} reference={value} />
		</div>
	</div>
</div>
