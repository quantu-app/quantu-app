<svelte:options immutable />

<script lang="ts">
	import ChallengeListItem from '$lib/components/challenges/ChallengeListItem.svelte';
	import type { StateChallenge } from '$lib/state/challenges';

	export let challenges: StateChallenge[];
</script>

<div class="container">
	<div class="row row-cols-lg-4 row-cols-md-3 row-cols-sm-2">
		{#each challenges as challenge (challenge.id)}
			<div class="col my-2">
				<ChallengeListItem {challenge} />
			</div>
		{/each}
	</div>
</div>
