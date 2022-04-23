<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import Challenge from '$lib/components/questions/Challenge.svelte';
	import type { StateChallenge } from '$lib/state/challenges';
	import type { StateChallengeSolution } from '$lib/state/challengeSolutions';

	export let challenge: StateChallenge;
	export let solution: StateChallengeSolution;
</script>

<a
	role="button"
	class="btn btn-ghost"
	href={`${base}/challenges/${challenge.department.url}/${challenge.url}/solutions`}
	><i class="bi bi-chevron-left" /> {solution.challenge.name}</a
>

<Challenge {challenge} disabled={true} />

<hr />

<RichViewer bind:value={solution.solution} placeholder="Type Solution..." />
