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
	import ChallengesMain from '$lib/components/challenges/ChallengesMain.svelte';
	import {
		challenges as challengesState,
		showAllChallenges,
		challengesByDepartment,
		type StateChallenge
	} from '$lib/state/challenges';
	import SEO from '$lib/components/SEO/index.svelte';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	$: topChallenges = $challengesState.sort(sortByDate).slice(0, 4);
	$: challengesByDepartments = Object.values($challengesByDepartment);
</script>

<SEO
	title="Challenges"
	description="University level problems requiring reasoning to solve."
	keywords="challenges, difficult problems, reasoning puzzles"
	robotsDirectives={['all']}
/>

<UserLayout>
	<ChallengesMain challenges={$challengesState} {topChallenges} {challengesByDepartments} />
</UserLayout>
