<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';

	export async function load(input) {
		const response = authGuard(input);
		return response;
	}
</script>

<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { currentUser } from '$lib/state/user';
	import EditProfile from '$lib/components/user/EditProfile.svelte';
</script>

<svelte:head>
	<title>Edit Profile</title>
</svelte:head>

<UserLayout>
	{#if $currentUser}
		<EditProfile user={$currentUser} />
	{/if}
</UserLayout>
