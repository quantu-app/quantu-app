<script lang="ts">
	import { goto } from '$app/navigation';
	import { createOrganization } from '$lib/state/userOrganizations';

	let organizationCreating = false;
	let newOrganizationName = '';

	async function onCreateOrganization() {
		organizationCreating = true;
		try {
			const organization = await createOrganization({ name: newOrganizationName });
			goto(`/user/organizations/${organization.id}`);
		} finally {
			organizationCreating = false;
		}
	}
</script>

<form on:submit|preventDefault class="mt-2">
	<div class="input-group">
		<input
			type="text"
			class="form-control"
			placeholder="New Organization name"
			bind:value={newOrganizationName}
		/>
		<button
			type="submit"
			disabled={organizationCreating || !newOrganizationName.trim()}
			class="btn btn-primary"
			aria-label="Create Organization"
			on:click={onCreateOrganization}
		>
			{#if organizationCreating}
				<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
			{/if}
			Create
		</button>
	</div>
</form>
