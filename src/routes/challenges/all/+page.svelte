<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { showAllChallenges, challenges } from '$lib/state/challenges';
	import SEO from '$lib/components/SEO/index.svelte';
	import ChallengesAll from '$lib/components/challenges/ChallengesAll.svelte';
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
