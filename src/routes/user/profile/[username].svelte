<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const username = input.params.username;
		const res = await input.fetch(`${base}/api/user/${username}`);
		if (!res.ok) {
			return {
				status: 404
			};
		}
		const user = userFromJSON(await res.json());

		return {
			props: {
				user,
				username: input.params.username
			}
		};
	};
</script>

<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { base } from '$app/paths';
	import type { User } from '@prisma/client';
	import Profile from '$lib/components/user/Profile.svelte';
	import { userFromJSON } from '$lib/state/user';

	export let username: string;
	export let user: User;
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<UserLayout>
	<Profile {user} />
</UserLayout>
