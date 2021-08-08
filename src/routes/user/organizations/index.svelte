<script lang="ts">
	import Organizations from '$lib/UserOrganizations/Organizations.svelte';
	import Layout from '$lib/Layout.svelte';
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

<Layout>
	<Organizations {organizations} />
</Layout>
