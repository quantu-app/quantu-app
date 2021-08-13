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

<div class="container">
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
