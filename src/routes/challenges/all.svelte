<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = authGuard(input);
		if (!isValidStatus(response)) {
			return response;
		}
		await showAllChallenges(input.fetch);
		return response;
	};

	function sortByDate(a: StateChallenge, b: StateChallenge) {
		return a.createdAt < b.createdAt ? 1 : -1;
	}
</script>

<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { showAllChallenges, challenges, type StateChallenge } from '$lib/state/challenges';
	import SEO from '$lib/components/SEO/index.svelte';
	import ChallengesAll from '$lib/components/challenges/ChallengesAll.svelte';
	import { isValidStatus } from '$lib/guard/isValidStatus';
</script>

<SEO
	title="Challenges"
	description="University level problems requiring reasoning to solve."
	keywords="challenges, difficult problems, reasoning puzzles"
	robotsDirectives={['all']}
/>

<UserLayout>
	<ChallengesAll challenges={$challenges} />
</UserLayout>
