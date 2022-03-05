<script lang="ts">
	import type { Department } from '@prisma/client';

	export let department: Department;
	export let onDeleteDepartment: () => Promise<void>;

	let deletingDepartment = false;

	async function internalOnDeleteDepartment() {
		deletingDepartment = true;
		try {
			await onDeleteDepartment();
		} finally {
			deletingDepartment = false;
		}
		window.bootstrap.Modal.getInstance('#delete-department').hide();
	}
</script>

<div
	class="modal fade"
	id="delete-department"
	tabindex="-1"
	aria-labelledby="delete-department-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="delete-department-label" class="modal-title">
					Delete {department?.name}
					{department?.id}
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={internalOnDeleteDepartment}
					class="btn btn-danger text-white"
				>
					{#if deletingDepartment}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{/if}
					Delete</button
				>
				<button type="button" class="btn btn-secondary text-white" data-bs-dismiss="modal"
					>Close</button
				>
			</div>
		</div>
	</div>
</div>
