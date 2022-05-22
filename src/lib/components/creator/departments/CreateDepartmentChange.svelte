<svelte:options immutable />

<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { createChange } from '$lib/state/creator/changes';
import type { Department } from '@prisma/client';
	import DepartmentChangeEditor from './DepartmentChangeEditor.svelte';

	let editorKey = Math.random();

	let departmentChange: Partial<Department> = {};

	let creatingDepartmentChange = false;
	async function onCreateDepartment() {
		creatingDepartmentChange = true;
		try {
			const { id } = await createChange('DEPARTMENT', null, departmentChange as any);
			window.bootstrap.Modal.getOrCreateInstance('#create-department').hide();
			await goto(`${base}/creator/departments/changes/${id}`);
			departmentChange = {};
		} finally {
			creatingDepartmentChange = false;
			editorKey = Math.random();
		}
	}
</script>

<button
	type="button"
	class="btn btn-primary"
	data-bs-toggle="modal"
	data-bs-target="#create-department"
	aria-label="Create Department">Create a new Department</button
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
				<h5 id="create-department-label" class="modal-title">Change a new Department</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				{#key editorKey}
					<DepartmentChangeEditor bind:departmentChange />
				{/key}
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={onCreateDepartment}
					disabled={creatingDepartmentChange}
					class="btn btn-primary"
				>
					{#if creatingDepartmentChange}
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
