<script lang="ts">
	import type { Organization } from '$lib/api/quantu-app-api';
	import { updateOrganization } from '$lib/state/userOrganizations';
	import { beforeUpdate } from 'svelte';

	export let organization: Organization;

	let prevId = organization.id;
	let url = organization.url;
	let name = organization.name;

	beforeUpdate(() => {
		if (prevId !== organization.id) {
			prevId = organization.id;
			resetForm();
		}
	});

	function resetForm() {
		url = organization.url;
		name = organization.name;
	}

	function onUrlChange() {
		onChange();
	}

	function onNameChange() {
		url = name
			.toLowerCase()
			.replace(/[^a-zA-Z0-9\-_]+/g, ' ')
			.trim()
			.replace(/\s+/g, '-');
		onChange();
	}

	async function onChange() {
		await updateOrganization(organization.id, {
			name,
			url
		});
	}
</script>

<div class="container-fluid h-100">
	<div class="d-flex flex-row h-100">
		<div class="container" />
		<div class="d-flex flex-column h-100 align-items-center flex-shrink-0">
			<div class="d-flex">
				<button
					type="button"
					role="button"
					class="btn btn-sm btn-primary"
					data-bs-toggle="modal"
					data-bs-target="#organization-settings"
					aria-label="Organization Settings"
					on:click={resetForm}><i class="bi bi-gear" /></button
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
					<label for="settings-organization-name" class="form-label">Name</label>
					<input
						id="settings-organization-name"
						type="text"
						class="form-control"
						placeholder="Enter Name"
						bind:value={name}
						on:change={onNameChange}
					/>
				</div>
				<div class="mb-4">
					<label for="settings-organization-location" class="form-label">URL</label>
					<input
						id="settings-organization-location"
						type="text"
						class="form-control"
						placeholder="Enter URL"
						bind:value={url}
						on:change={onUrlChange}
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
