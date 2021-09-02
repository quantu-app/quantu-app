<script lang="ts">
	import type { Organization } from '$lib/api/quantu-app-api';
	import { updateOrganization } from '$lib/state/userOrganizations';
	import { debounce } from "@aicacia/debounce";
	import Tags from '$lib/Tags.svelte';

	export let organization: Organization;

	function onUrlChange() {
		updateOrganization(organization.id, {
			url: organization.url
		});
	}

	function onNameChange() {
		updateOrganization(organization.id, {
			name: organization.name
		});
	}

	function onTagsChange() {
		updateOrganization(organization.id, {
			tags: organization.tags
		});
	}

	const debouncedOnTagsChange = debounce(onTagsChange, 1000);
</script>

<div class="container mt-2">
	<form on:submit|preventDefault>
		<div class="mb-2">
			<label for="organization-name" class="form-label">Organization Name</label>
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
			<label for="organization-location" class="form-label">Organization URL</label>
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
			<label for="organization-tags" class="form-label">Organization Tags</label>
			<Tags id="organization-tags" bind:tags={organization.tags} on:change={debouncedOnTagsChange} />
		</div>
	</form>

	<hr />

	<div class="row">
		<div class="col">
			<a
				role="button"
				class="btn btn-primary w-100"
				href={`/user/organizations/${organization.id}/quizzes`}>Quizzes</a
			>
		</div>
		<div class="col">
			<a
				role="button"
				class="btn btn-primary w-100"
				href={`/user/organizations/${organization.id}/questions`}>Questions</a
			>
		</div>
	</div>
</div>
