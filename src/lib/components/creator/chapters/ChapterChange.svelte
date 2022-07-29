<svelte:options immutable />

<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { updateChange, type StateChange } from '$lib/state/creator/changes';
	import type { StateChapter } from '$lib/state/creator/chapters';
	import { createMergeRequest, type StateMergeRequest } from '$lib/state/creator/mergeRequests';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { filterObjectByNullOrUndefined } from '$lib/utils';
	import ChapterChangeEditor from './ChapterChangeEditor.svelte';

	export let chapterChange: StateChange;
	export let chapter: StateChapter | undefined = undefined;
	export let mergeRequest: StateMergeRequest | undefined = undefined;

	$: value = Object.assign({}, chapter, filterObjectByNullOrUndefined(chapterChange.value as any));

	let creatingMerge = false;
	async function onCreateMerge() {
		creatingMerge = true;
		try {
			const mergeRequest = await createMergeRequest(chapterChange.id);
			await goto(`${base}/creator/merge-requests/${mergeRequest.id}`);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Creating Merge',
				description: (e as Error).message
			});
		} finally {
			creatingMerge = false;
		}
	}

	let updating = false;
	async function onUpdate() {
		updating = true;
		const diff: StateChange['value'] = {};
		if (value.name !== chapter?.name) {
			diff.name = value.name;
		}
		if (value.url !== chapter?.url) {
			diff.url = value.url;
		}
		if (value.logoId !== chapter?.logoId) {
			diff.logoId = value.logoId;
		}
		if (value.description !== chapter?.description) {
			diff.description = value.description;
		}
		try {
			await updateChange(chapterChange.id, chapterChange.name, diff);
		} finally {
			updating = false;
		}
	}
</script>

<div class="container mb-8">
	<div class="d-flex justify-between-end mb-2">
		<div class="flex-grow-1 row">
			<div class="col-8">
				<label for="name" class="form-label">Name of this Change</label>
				<input
					id="name"
					type="text"
					class="form-control"
					placeholder="Change Name"
					bind:value={chapterChange.name}
				/>
			</div>
		</div>
		<div class="flex-grow-0">
			{#if mergeRequest}
				<a
					role="button"
					href={`${base}/creator/merge-requests/${mergeRequest.id}`}
					class="btn btn-primary">Merge Request</a
				>
			{:else}
				<button
					type="button"
					on:click={onCreateMerge}
					class="btn btn-primary"
					disabled={creatingMerge}>Create Merge Request</button
				>
			{/if}
		</div>
	</div>

	<div>
		<ChapterChangeEditor chapterChange={value} />
	</div>

	<div class="d-flex justify-content-end">
		<button type="button" on:click={onUpdate} class="btn btn-primary" disabled={updating}
			>Save Change</button
		>
	</div>
</div>
