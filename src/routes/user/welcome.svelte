<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';

	export async function load(input: LoadInput) {
		return authGuard(input);
	}
</script>

<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { currentUser } from '$lib/state/user';
	import Welcome from '$lib/components/user/Welcome.svelte';
</script>

<svelte:head>
	<title>Welcome</title>
</svelte:head>

<UserLayout>
	<Welcome user={$currentUser} />
</UserLayout>
