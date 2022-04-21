<script lang="ts">
	import type { StateChallenge } from '$lib/state/challenges';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import type { StateChallengeSolution } from '$lib/state/challengeSolutions';
	import { base } from '$app/paths';

	export let challenge: StateChallenge;
	export let solution: StateChallengeSolution;
</script>

<div>
	<RichViewer value={solution.solution} />
	<div>
		<div>{solution.user.username}</div>
		<a
			href={`${base}/challenges/${solution.challenge.department.url}/${solution.challenge.url}/solutions/${solution.id}`}
			>View Thread ({solution.commentCount})</a
		>
	</div>
</div>
