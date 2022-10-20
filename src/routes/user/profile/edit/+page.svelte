<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { currentUser } from '$lib/state/user';
	import EditProfile from '$lib/components/user/EditProfile.svelte';

	$: user = $currentUser;
</script>

<svelte:head>
	<title>Edit Profile</title>
</svelte:head>

<UserLayout>
	<div class="container mb-8">
		{#if user}
			<EditProfile {user} />
		{/if}
	</div>
</UserLayout>
