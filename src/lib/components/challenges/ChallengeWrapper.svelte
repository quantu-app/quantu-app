<svelte:options immutable />

<script lang="ts">
	import type { StateChallenge } from '$lib/state/creator/challenges';
	import Stats from './Stats.svelte';

	export let challenge: StateChallenge;
	const CORRECT_THRESHOLD = 0.6;

	$: correct = challenge.answers.reduce((init, cur) => {
		if (cur >= CORRECT_THRESHOLD) {
			return init + 1;
		} else {
			return init;
		}
	}, 0);
</script>

<div class="container">
	<div class="row mt-4">
		<div class="col-6">
			<span>
				<span class="linkArrow"> &lt; </span>
				<a class="link-dark" href="/challenges"> Back to Challenges </a>
			</span>
		</div>
		<div class="col-6 text-end">
			<!-- <Stats totalSolvers={challenge.solutions} {correct} /> -->
			<Stats totalSolvers={10} correct={10} />
		</div>
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
