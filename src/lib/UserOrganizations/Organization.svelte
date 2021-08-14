<script lang="ts">
	import type { Organization } from '$lib/api/quantu-app-api';
	import { updateOrganization } from '$lib/state/userOrganizations';
	import Tags from '$lib/Tags.svelte';

	export let organization: Organization;

	function onUrlChange() {
		updateOrganization(organization.id, {
			url: organization.url
		});
	}

	function onNameChange() {
		organization.url = organization.name
			.toLowerCase()
			.replace(/[^a-zA-Z0-9\-_]+/g, ' ')
			.trim()
			.replace(/\s+/g, '-');
		updateOrganization(organization.id, {
			name: organization.name,
			url: organization.url
		});
	}

	function onTagsChange() {
		updateOrganization(organization.id, {
			tags: organization.tags
		});
	}
</script>

<div class="container">
	<div class="mb-2">
		<label for="organization-name" class="form-label">Name</label>
		<input
			id="organization-name"
			type="text"
			class="form-control"
			placeholder="Enter Name"
			bind:value={organization.name}
			on:change={onNameChange}
		/>
	</div>
	<div class="mb-2">
		<label for="organization-location" class="form-label">URL</label>
		<input
			id="organization-location"
			type="text"
			class="form-control"
			placeholder="Enter URL"
			bind:value={organization.url}
			on:change={onUrlChange}
		/>
	</div>
	<div class="mb-2">
		<label for="organization-tags" class="form-label">Quiz Tags</label>
		<Tags id="organization-tags" bind:tags={organization.tags} on:change={onTagsChange} />
	</div>
</div>
