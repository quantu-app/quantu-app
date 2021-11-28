<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input);
		if (!browser && isValidStatus(response)) {
			await getOrganizations();
		}
		return response;
	}
</script>

<script lang="ts">
	import Organizations from '$lib/UserOrganizations/Organizations.svelte';
	import { getOrganizations, userOrganizations } from '$lib/state/userOrganizations';
	import OrganizationLayout from '$lib/UserOrganizations/OrganizationLayout.svelte';

	$: organizations = Object.values($userOrganizations.byId);

	if (browser) {
		getOrganizations(true);
	}
</script>

<svelte:head>
	<title>Organizations</title>
</svelte:head>

<OrganizationLayout
	breadcrumbs={[
		{ href: '/', title: 'Home' },
		{
			href: `/user/organizations`,
			title: 'My Organizations'
		}
	]}
>
	<Organizations {organizations} />
</OrganizationLayout>
