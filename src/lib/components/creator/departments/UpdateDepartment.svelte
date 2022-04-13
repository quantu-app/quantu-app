<script lang="ts">
	import type { Department } from '@prisma/client';
	import DepartmentEditor from './DepartmentEditor.svelte';

	export let department: Department | undefined;
	export let onUpdateDepartment: () => Promise<void>;

	$: console.log(department);

	async function internalUpdateDepartment() {
		await onUpdateDepartment();
		window.bootstrap.Modal.getInstance('#update-department').hide();
	}
</script>

<div
	class="modal fade"
	id="update-department"
	tabindex="-1"
	aria-labelledby="update-department-label"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="update-department-label" class="modal-title">Update Department</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				{#if department}
					{#key department.id}
						<DepartmentEditor bind:department />
					{/key}
				{/if}
			</div>
			<div class="modal-footer">
				<button type="button" on:click={internalUpdateDepartment} class="btn btn-primary"
					>Update</button
				>
				<button type="button" class="btn btn-danger text-white" data-bs-dismiss="modal"
					>Close</button
				>
			</div>
		</div>
	</div>
</div>
