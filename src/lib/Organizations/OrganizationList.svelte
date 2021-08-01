<script lang="ts">
	import type { Organization } from '$lib/api/quantu-app-api';
	import OrganizationListItem from './OrganizationListItem.svelte';

	export let organizations: [string, Organization][];
	export let createOnDelete: (localId: string, organization: Organization) => () => void;
</script>

<div class="list-group list-group-flush">
	{#each organizations as [localId, organization]}
		<OrganizationListItem
			{localId}
			{organization}
			onDelete={createOnDelete(localId, organization)}
		/>
	{/each}
</div>
