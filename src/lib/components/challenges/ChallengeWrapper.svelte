<svelte:options immutable />

<script lang="ts">
	import type { StateChallenge } from '$lib/state/creator/challenges';
	import Stats from './Stats.svelte';

	export let challenge: StateChallenge;
	const CORRECT_THRESHOLD = 0.6; // TODO: set this as a config option for lesson blocks globally

	$: correct = challenge.answers.reduce((correct, result) => {
		if (result.value >= CORRECT_THRESHOLD) {
			return correct + 1;
		} else {
			return correct;
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
			<Stats totalSolvers={challenge.answers.length} {correct} />
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
