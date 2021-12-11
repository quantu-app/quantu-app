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
	import OrganizationList from './OrganizationList.svelte';
	import type { Organization } from '$lib/api/quantu-app-api';
	import Search from '$lib/Search.svelte';
	import CreateOrganization from './CreateOrganization.svelte';

	export let organizations: Organization[];

	$: filter = (organization: Organization) =>
		$state.organizationNameFilter
			? fuzzyEquals($state.organizationNameFilter, organization.name)
			: true;
</script>

<div class="container mb-2">
	<div class="d-flex justify-content-end">
		<CreateOrganization />
	</div>
	<Search bind:filter={$state.organizationNameFilter} />
</div>

<div class="container">
	<OrganizationList organizations={organizations.filter(filter)} />
</div>
