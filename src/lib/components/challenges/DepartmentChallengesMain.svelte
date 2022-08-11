<svelte:options immutable />

<script lang="ts">
	import ChallengeList from '$lib/components/challenges/ChallengeList.svelte';
	import type { StateChallenge } from '$lib/state/challenges';
	import type { Department } from '@prisma/client';
	import { base } from '$app/paths';

	export let department: Department;
	export let challenges: StateChallenge[];
	export let newestChallenges: StateChallenge[];
</script>

<div class="container my-4 mb-8">
	{#if newestChallenges.length}
		<div class="row">
			<h2>Newest Challenges</h2>
			<ChallengeList challenges={newestChallenges} />
		</div>
		<div class="row mt-3 text-end">
			<a class="viewAllChallenges" href={`${base}/${Department.url}/challenges/all`}>
				<span class="linkText">View All Challenges</span>
				<span class="linkArrow"> &gt; </span>
			</a>
		</div>
	{/if}
	<hr />
	{#if challenges.length}
		<ChallengeList {challenges} />
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
