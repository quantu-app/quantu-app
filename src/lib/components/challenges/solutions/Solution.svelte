<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import Comments from '$lib/components/comments/Comments.svelte';
	import CreateComment from '$lib/components/comments/CreateComment.svelte';
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
	><i class="bi bi-chevron-left" /> {challenge.name}</a
>

<Challenge {challenge} disabled={true} />

<hr />

<div>
	<RichViewer bind:value={solution.solution} placeholder="Type Solution..." />
</div>

<h3 class="mt-4 mb-0 pb-0">Comments</h3>

<hr class="mt-0" />

<div>
	<CreateComment referenceId={solution.id} referenceType="CHALLENGE_SOLUTION" />
</div>

<Comments referenceId={solution.id} referenceType="CHALLENGE_SOLUTION" />
