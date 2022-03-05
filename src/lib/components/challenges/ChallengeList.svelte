<script lang="ts">
	import ChallengeListItem from '$lib/components/challenges/ChallengeListItem.svelte';
import type { StateChallenge } from '$lib/state/challenges';

	export let challenges: Array<StateChallenge>;
</script>

<div class="container">
	{#each challenges as challenge}
		<ChallengeListItem {challenge} />
	{/each}
</div>
