<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		organizationNameFilter: string | undefined;
	}

	const state = writable<IState>({
		organizationNameFilter: undefined
	});
</script>

<script lang="ts">
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import { beforeUpdate } from 'svelte';
	import { organizations, deleteOrganization } from '$lib/state/organizations';
	import DeleteOrganization from '$lib/Organizations/DeleteOrganization.svelte';
	import SearchBar from '$lib/Organizations/SearchBar.svelte';
	import OrganizationList from './OrganizationList.svelte';
	import type { Organization } from '$lib/api/quantu-app-api';

	let prevOrganizationNameFilter: string = $state.organizationNameFilter;

	let deleteOrganizationId: string;
	let organizationToDelete: Organization;

	$: list = Object.entries($organizations).filter(filter).sort(sort);

	function filter([_localId, organization]: [string, Organization]) {
		return $state.organizationNameFilter
			? fuzzyEquals($state.organizationNameFilter, organization.name)
			: true;
	}

	function sort(
		[_aLocalId, aOrganization]: [string, Organization],
		[_bLocalId, bOrganization]: [string, Organization]
	) {
		let aValue = new Date(aOrganization.insertedAt),
			bValue = new Date(bOrganization.insertedAt);
		return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
	}

	function createOnDelete(organizationId: string, organization: Organization) {
		return function onDelete() {
			deleteOrganizationId = organizationId;
			organizationToDelete = organization;
		};
	}

	function onDeleteOrganization() {
		if (deleteOrganizationId) {
			deleteOrganization(deleteOrganizationId);
			organizationToDelete = undefined;
		}
	}

	beforeUpdate(() => {
		if ($state.organizationNameFilter !== prevOrganizationNameFilter) {
			list = Object.entries($organizations).filter(filter).sort(sort);
		}
	});
</script>

<div class="container-md mb-2">
	<SearchBar bind:organizationNameFilter={$state.organizationNameFilter} />
</div>

<div class="container-md">
	<OrganizationList organizations={list} {createOnDelete} />
	<DeleteOrganization {organizationToDelete} {onDeleteOrganization} />
</div>
