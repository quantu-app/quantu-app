<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = await authGuard(input);
		if (!browser && isValidStatus(response)) {
			await getOrganizations();
		}
		return response;
	}
</script>

<script lang="ts">
	import Organizations from '$lib/UserOrganizations/Organizations.svelte';
	import AppLayout from '$lib/AppLayout.svelte';
	import { getOrganizations, userOrganizations } from '$lib/state/userOrganizations';

	$: organizations = Object.values($userOrganizations.byId);

	if (browser) {
		getOrganizations();
	}
</script>

<svelte:head>
	<title>Organizations</title>
</svelte:head>

<AppLayout>
	<Organizations {organizations} />
</AppLayout>
