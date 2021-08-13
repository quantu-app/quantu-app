<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';

	export async function load(input: LoadInput) {
		return authGuard(input);
	}
</script>

<script lang="ts">
	import Organizations from '$lib/UserOrganizations/Organizations.svelte';
	import AppLayout from '$lib/AppLayout.svelte';
	import { getOrganizations, userOrganizations } from '$lib/state/userOrganizations';
	import { currentUser } from '$lib/state/user';

	$: organizations = Object.values($userOrganizations.byId);

	$: if ($currentUser) {
		getOrganizations();
	}
</script>

<svelte:head>
	<title>Organizations</title>
</svelte:head>

<AppLayout>
	<Organizations {organizations} />
</AppLayout>
