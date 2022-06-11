<svelte:options immutable />

<script lang="ts">
	import type { StateChange } from '$lib/state/creator/changes';
	import { mergeMergeRequest, type StateMergeRequest } from '$lib/state/creator/mergeRequests';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import type { Prisma } from '@prisma/client';
	import Change from './Change.svelte';

	export let mergeRequest: StateMergeRequest;
	export let change: StateChange;
	export let prevChangeValue: Prisma.JsonObject | null = null;

	$: value = Object.assign({}, mergeRequest.reference, change.value);

	let merging = false;
	async function onMerge() {
		merging = true;
		try {
			await mergeMergeRequest(mergeRequest.id);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Merging',
				description: (e as Error).message
			});
		} finally {
			merging = false;
		}
	}
</script>

<div class="container">
	<div class="d-flex justify-between-end">
		<h1 class="flex-grow-1 m-0">{change.name}</h1>
		<div class="flex-grow-0">
			<button class="btn btn-primary" disabled={mergeRequest.merged || merging} on:click={onMerge}>
				{#if mergeRequest.merged}
					Merged
				{:else}
					Merge
				{/if}
			</button>
		</div>
	</div>
	<hr />
</div>
<div class="container mb-8">
	<div class="row">
		{#if prevChangeValue}
			<div class="col">
				<h1>Old</h1>
				<Change referenceType={mergeRequest.change.referenceType} reference={prevChangeValue} />
			</div>
		{/if}
		<div class="col">
			<h1>New</h1>
			<Change referenceType={mergeRequest.change.referenceType} reference={value} />
		</div>
	</div>
</div>
