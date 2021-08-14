<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';

	export async function load(input: LoadInput) {
		const response = await authGuard(input);
		if (response.status !== 302) {
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
</script>

<svelte:head>
	<title>Organizations</title>
</svelte:head>

<AppLayout>
	<Organizations {organizations} />
</AppLayout>
