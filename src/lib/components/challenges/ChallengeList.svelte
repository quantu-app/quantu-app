<script lang="ts">
	import ChallengeListItem from '$lib/components/challenges/ChallengeListItem.svelte';
	import type { StateChallenge } from '$lib/state/challenges';

	export let challenges: Array<StateChallenge>;

	let cols = 3;
</script>

<div class="container">
	<div class="row row-cols-3">
		{#each challenges as challenge, idx}
			<div class="col">
				<ChallengeListItem challenge={challenges[idx]} />
			</div>
		{/each}
	</div>
</div>
