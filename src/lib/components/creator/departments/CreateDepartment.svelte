<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { createDepartment } from '$lib/state/creator/departments';
	import type { Department } from '@prisma/client';
	import DepartmentEditor from './DepartmentEditor.svelte';

	let editorKey = Math.random();
	let creatingDepartment = false;

	let department: Partial<Department> = {};

	async function onCreateDepartment() {
		creatingDepartment = true;
		try {
			const { id } = await createDepartment(department);
			window.bootstrap.Modal.getInstance('#create-department').hide();
			await goto(`${base}/creator/departments/${id}`);
			department = {};
		} finally {
			creatingDepartment = false;
			editorKey = Math.random();
		}
	}
</script>

<button
	type="button"
	class="btn btn-primary"
	data-bs-toggle="modal"
	data-bs-target="#create-department"
	aria-label="Create Department">Create Department</button
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
				<h5 id="create-department-label" class="modal-title">Create Department</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				{#key editorKey}
					<DepartmentEditor bind:department />
				{/key}
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={onCreateDepartment}
					disabled={creatingDepartment}
					class="btn btn-primary"
				>
					{#if creatingDepartment}
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
