<svelte:options immutable />

<script lang="ts">
	import type { StateChallenge } from '$lib/state/creator/challenges';

	export let challenge: StateChallenge;
</script>

<div class="container">
	<div class="row mt-4">
		<a class="mainChallenges" href="/challenges">
			<span class="linkArrow"> &lt; </span>
			<span class="linkText">Back to Challenges</span>
		</a>
	</div>
	<div class="row mb-5">
		<div class="col">
			{#if challenge}
				<div id="challenge-content" data-challenge-id={challenge.id}>
					<div class="row mt-3 mx-2">
						<div class="col">
							<slot />
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style type="css">
	a.mainChallenges {
		color: black;
		text-decoration: none;
	}
	a.mainChallenges .linkText {
		text-decoration: underline;
	}
	a.mainChallenges .linkArrow {
		text-decoration: none;
	}
</style>
