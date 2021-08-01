<script lang="ts">
	import type { Organization } from '$lib/api/quantu-app-api';
	import { updateOrganization } from '$lib/state/organizations';

	export let localId: string;
	export let organization: Organization;

	function onNameChange() {
		organization.url = organization.name
			.toLowerCase()
			.replace(/[^a-zA-Z0-9\-_]+/g, ' ')
			.trim()
			.replace(/\s+/g, '-');
		updateOrganization(localId, {
			name: organization.name,
			url: organization.url
		});
	}
</script>

<div class="container-fluid h-100">
	<div class="d-flex flex-row h-100">
		<div class="container-md" />
		<div class="d-flex flex-column h-100 align-items-center flex-shrink-0">
			<div class="d-flex">
				<button
					type="button"
					role="button"
					class="btn btn-sm btn-primary"
					data-bs-toggle="modal"
					data-bs-target="#organization-settings"
					aria-label="Organization Settings"><i class="bi bi-gear" /></button
				>
			</div>
		</div>
	</div>
</div>

<div
	class="modal fade"
	id="organization-settings"
	tabindex="-1"
	aria-labelledby="organization-settings-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="organization-settings-label" class="modal-title">Settings</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="mb-4">
					<label for="settings-organization-name" class="form-label">Title</label>
					<input
						id="settings-organization-name"
						type="text"
						class="form-control"
						placeholder="Enter title"
						bind:value={organization.name}
						on:change={onNameChange}
					/>
				</div>
				<div class="mb-4">
					<label for="settings-organization-location" class="form-label">Location</label>
					<input
						id="settings-organization-location"
						type="text"
						disabled
						class="form-control"
						placeholder="Enter location"
						bind:value={organization.url}
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
