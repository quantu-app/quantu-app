<svelte:options immutable />

<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { updateChange, type StateChange } from '$lib/state/creator/changes';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import { createMergeRequest, type StateMergeRequest } from '$lib/state/creator/mergeRequests';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { filterObjectByNullOrUndefined } from '$lib/utils';
	import DepartmentChangeEditor from './DepartmentChangeEditor.svelte';

	export let departmentChange: StateChange;
	export let department: StateDepartment | undefined = undefined;
	export let mergeRequest: StateMergeRequest | undefined = undefined;

	$: value = Object.assign(
		{},
		department,
		filterObjectByNullOrUndefined(departmentChange.value as any)
	);

	let creatingMerge = false;
	async function onCreateMerge() {
		creatingMerge = true;
		try {
			const mergeRequest = await createMergeRequest(departmentChange.id);
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
		if (value.name !== department?.name) {
			diff.name = value.name;
		}
		if (value.url !== department?.url) {
			diff.url = value.url;
		}
		if (value.logoId !== department?.logoId) {
			diff.logoId = value.logoId;
		}
		if (value.description !== department?.description) {
			diff.description = value.description;
		}
		try {
			await updateChange(departmentChange.id, departmentChange.name, diff);
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
					bind:value={departmentChange.name}
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
		<DepartmentChangeEditor departmentChange={value} />
	</div>

	<div class="d-flex justify-content-end">
		<button type="button" on:click={onUpdate} class="btn btn-primary" disabled={updating}
			>Save Change</button
		>
	</div>
</div>
