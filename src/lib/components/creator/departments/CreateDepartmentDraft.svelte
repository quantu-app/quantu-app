<svelte:options immutable />

<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import {
		createDepartmentDraft,
		type StateDepartmentDraft
	} from '$lib/state/creator/departmentDrafts';
	import DepartmentDraftEditor from './DepartmentDraftEditor.svelte';

	let editorKey = Math.random();

	let departmentDraft: Partial<StateDepartmentDraft> = {};

	let creatingDepartmentDraft = false;
	async function onCreateDepartment() {
		creatingDepartmentDraft = true;
		try {
			const { id } = await createDepartmentDraft(departmentDraft);
			window.bootstrap.Modal.getOrCreateInstance('#create-department').hide();
			await goto(`${base}/creator/departments/drafts/${id}`);
			departmentDraft = {};
		} finally {
			creatingDepartmentDraft = false;
			editorKey = Math.random();
		}
	}
</script>

<button
	type="button"
	class="btn btn-primary"
	data-bs-toggle="modal"
	data-bs-target="#create-department"
	aria-label="Create Department">Draft a new Department</button
>

<div
	class="modal fade"
	id="create-department"
	tabindex="-1"
	aria-labelledby="create-department-label"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="create-department-label" class="modal-title">Draft a new Department</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				{#key editorKey}
					<DepartmentDraftEditor bind:departmentDraft />
				{/key}
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={onCreateDepartment}
					disabled={creatingDepartmentDraft}
					class="btn btn-primary"
				>
					{#if creatingDepartmentDraft}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{/if}
					Create
				</button>
				<button type="button" class="btn btn-secondary text-white" data-bs-dismiss="modal"
					>Close</button
				>
			</div>
		</div>
	</div>
</div>
