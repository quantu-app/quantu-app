<script context="module" lang="ts">
	import type { LoadInput } from '@sveltejs/kit';

	export async function load(input: LoadInput) {
		return {
			props: {
				username: input.params.username
			}
		};
	}
</script>

<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { base } from '$app/paths';
	import type { User } from '@prisma/client';
	import Profile from '$lib/components/user/Profile.svelte';
	import { onMount } from 'svelte';

	export let username: string;

	let user: User;
	let loaded = false;

	onMount(async () => {
		user = await fetch(`${base}/api/user/${username}`).then((res) => {
			loaded = true;
			if (!res.ok) {
				return null;
			}
			return res.json();
		});
	});
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<UserLayout>
	{#if user && loaded}
		<Profile {user} />
	{/if}
	{#if !user && loaded}
		<div class="container mt-4">
			<h1>User {username} not found.</h1>
		</div>
	{/if}
</UserLayout>
