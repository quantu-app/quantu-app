<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = await authGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		await showAllChallenges(input.fetch);
		return response;
	};
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
	import { sortByCreatedAt } from '$lib/utils';

	$: topChallenges = $challengesState.sort(sortByCreatedAt).slice(0, 4);
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
