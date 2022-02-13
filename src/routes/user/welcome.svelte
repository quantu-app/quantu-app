<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';

	export async function load(input: LoadInput) {
		const response = authGuard(input);
		return response;
	}
</script>

<script lang="ts">
	import AppLayout from '$lib/components/AppLayout.svelte';
	import { currentUser } from '$lib/state/user';
	import Welcome from '$lib/components/Welcome.svelte';
</script>

<svelte:head>
	<title>Welcome</title>
</svelte:head>

<AppLayout>
	{#if $currentUser}
		<Welcome user={$currentUser} />
	{/if}
</AppLayout>
