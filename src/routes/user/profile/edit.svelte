<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';

	export const load: Load = (input) => authGuard(input);
</script>

<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { currentUser } from '$lib/state/user';
	import EditProfile from '$lib/components/user/EditProfile.svelte';
	import type { Load } from '@sveltejs/kit';
</script>

<svelte:head>
	<title>Edit Profile</title>
</svelte:head>

<UserLayout>
	<div class="container mb-8">
		<EditProfile user={$currentUser} />
	</div>
</UserLayout>
