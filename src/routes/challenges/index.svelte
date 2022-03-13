<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = (input) => {
		return authGuard(input);
	};
</script>

<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import Challenges from '$lib/components/challenges/Challenges.svelte';
	import { browser } from '$app/env';
	import { showAllChallenges, challenges } from '$lib/state/challenges';

	if (browser) {
		showAllChallenges();
	}
</script>

<svelte:head>
	<title>Challenges</title>
</svelte:head>

<UserLayout>
	<Challenges challenges={$challenges} />
</UserLayout>
