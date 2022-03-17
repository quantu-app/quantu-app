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
	import SEO from '$lib/components/seo/index.svelte';

	if (browser) {
		showAllChallenges();
	}
</script>

<SEO
	title="Challenges"
	description="University level problems requiring reasoning to solve."
	keywords="challenges, difficult problems, reasoning puzzles"
	robotsDirectives={['all']}
/>

<UserLayout>
	<Challenges challenges={$challenges} />
</UserLayout>
