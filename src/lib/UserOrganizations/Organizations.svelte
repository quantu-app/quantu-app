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
	import ActionBar from '$lib/UserOrganizations/ActionBar.svelte';
	import OrganizationList from './OrganizationList.svelte';
	import type { Organization } from '$lib/api/quantu-app-api';

	export let organizations: Organization[];

	function filter(organization: Organization) {
		return $state.organizationNameFilter
			? fuzzyEquals($state.organizationNameFilter, organization.name)
			: true;
	}
</script>

<div class="container-md mb-2">
	<ActionBar bind:organizationNameFilter={$state.organizationNameFilter} />
</div>

<div class="container-md">
	<OrganizationList organizations={organizations.filter(filter)} />
</div>
