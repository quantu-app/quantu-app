<svelte:options immutable />

<script lang="ts">
	import ChallengeList from '$lib/components/challenges/ChallengeList.svelte';
	import type { StateChallenge } from '$lib/state/challenges';

	export let challenges: StateChallenge[];
	export let topChallenges: StateChallenge[];
	export let challengesByDepartments: {
		url: string;
		name: string;
		challenges: StateChallenge[];
	}[];
</script>

<div class="container my-4 mb-8">
	{#if topChallenges.length}
		<div class="row">
			<h2>Newest Challenges</h2>

			<ChallengeList challenges={topChallenges} />
		</div>
		<div class="row mt-3 text-end">
			<a class="viewAllChallenges" href="/challenges/all">
				<span class="linkText">View All Challenges</span>
				<span class="linkArrow"> &gt; </span>
			</a>
		</div>
	{/if}
	<hr />
	{#if challengesByDepartments.length}
		{#each challengesByDepartments as depChallenges (depChallenges.url)}
			<div class="row mt-4">
				<h2>{depChallenges.name}</h2>
				<ChallengeList challenges={depChallenges.challenges} />
			</div>
		{/each}
	{/if}
</div>

<style>
	a.viewAllChallenges {
		color: black;
		text-decoration: none;
	}
	a.viewAllChallenges .linkText {
		text-decoration: underline;
	}
	a.viewAllChallenges .linkArrow {
		text-decoration: none;
	}
</style>
