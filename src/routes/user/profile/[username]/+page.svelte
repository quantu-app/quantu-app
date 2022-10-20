<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import Profile from '$lib/components/user/Profile.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<UserLayout>
	<Profile user={data.user} />
</UserLayout>
