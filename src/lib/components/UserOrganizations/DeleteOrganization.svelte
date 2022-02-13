<script lang="ts">
	import type { Organization } from '$lib/api/quantu-app-api';

	export let organizationToDelete: Organization;
	export let onDeleteOrganization: () => void;

	let deleteOrganizationText = '';

	function internalOnDeleteOrganization() {
		deleteOrganizationText = '';
		onDeleteOrganization();
	}
</script>

<div
	class="modal fade"
	id="delete-organization"
	tabindex="-1"
	aria-labelledby="delete-organization-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="delete-organization-label" class="modal-title">
					Delete {organizationToDelete?.name}
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="input-group">
					<input
						type="text"
						class="form-control"
						placeholder="Type delete to permanently remove."
						bind:value={deleteOrganizationText}
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={internalOnDeleteOrganization}
					disabled={deleteOrganizationText.trim().toLowerCase() !== 'delete'}
					data-bs-dismiss="modal"
					class="btn btn-danger text-white">Delete</button
				>
				<button type="button" class="btn btn-danger text-white" data-bs-dismiss="modal"
					>Close</button
				>
			</div>
		</div>
	</div>
</div>
