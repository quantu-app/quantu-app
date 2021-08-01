<script lang="ts">
	import { goto } from '$app/navigation';
	import { createOrganization } from '$lib/state/organizations';

	export let organizationNameFilter: string;

	let organizationCreating = false;

	async function onCreateOrganization() {
		organizationCreating = true;
		try {
			const [localId, _organization] = await createOrganization(
				new Date().toLocaleString('en-us', {
					month: 'short',
					day: 'numeric',
					year: 'numeric'
				})
			);
			goto(`/user/organizations/${localId}`);
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
			placeholder="Filter"
			bind:value={organizationNameFilter}
		/>
		<button
			type="submit"
			disabled={organizationCreating}
			class="btn btn-primary"
			aria-label="Add Entry"
			on:click={onCreateOrganization}
		>
			{#if organizationCreating}
				<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
			{/if}
			Add Entry
		</button>
	</div>
</form>
