<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';

	export const load: Load = (input) => authGuard(input);
</script>

<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { currentUser } from '$lib/state/user';
	import Welcome from '$lib/components/user/Welcome.svelte';
	import type { Load } from '@sveltejs/kit';
</script>

<svelte:head>
	<title>Welcome</title>
</svelte:head>

<UserLayout>
	<div class="container mb-8">
		<Welcome user={$currentUser} />
	</div>
</UserLayout>
