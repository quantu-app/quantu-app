<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import Welcome from '$lib/components/user/Welcome.svelte';
	import { currentUser } from '$lib/state/user';

	$: user = $currentUser;
</script>

<svelte:head>
	<title>Welcome</title>
</svelte:head>

<UserLayout>
	<div class="container mb-8">
		{#if user}
			<Welcome {user} />
		{/if}
	</div>
</UserLayout>
