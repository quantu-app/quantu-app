<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import ChallengesMain from '$lib/components/challenges/ChallengesMain.svelte';
	import { challenges as challengesState, challengesByDepartment } from '$lib/state/challenges';
	import SEO from '$lib/components/SEO/index.svelte';

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
