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
	import EditProfile from '$lib/components/EditProfile.svelte';
</script>

<svelte:head>
	<title>Edit Profile</title>
</svelte:head>

<AppLayout>
	{#if $currentUser}
		<EditProfile user={$currentUser} />
	{/if}
</AppLayout>
