<script lang="ts">
	import type { Organization } from '$lib/api/quantu-app-api';
	import { deleteOrganization } from '$lib/state/userOrganizations';
	import DeleteOrganization from './DeleteOrganization.svelte';
	import OrganizationListItem from './OrganizationListItem.svelte';

	export let organizations: Organization[];

	let organizationToDelete: Organization;

	function createOnDelete(organization: Organization) {
		return function onDelete() {
			organizationToDelete = organization;
		};
	}

	function onDeleteOrganization() {
		if (organizationToDelete) {
			deleteOrganization(organizationToDelete.id);
			organizationToDelete = undefined;
		}
	}
</script>

<div class="list-group list-group-flush">
	{#each organizations as organization}
		<OrganizationListItem {organization} onDelete={createOnDelete(organization)} />
	{/each}
</div>

<DeleteOrganization {organizationToDelete} {onDeleteOrganization} />
