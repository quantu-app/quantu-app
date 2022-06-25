<svelte:options immutable />

<script lang="ts">
	import type { StateChallenge } from '$lib/state/creator/challenges';

	export let challenge: StateChallenge;
</script>

<div class="container">
	<div class="row mt-4">
		<span>
			<span class="linkArrow"> &lt; </span>
			<a class="link-dark" href="/challenges"> Back to Challenges </a>
		</span>
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
