<svelte:options immutable />

<script lang="ts">
	import type { StateLessonBlock } from '$lib/state/lessonBlocks';
	import { base } from '$app/paths';
	export let lessonBlock: StateLessonBlock;
	const CORRECT_THRESHOLD = 0.6;

	// $: correct = lessonBlock.answers.reduce((correct, result) => {
	// 	if (result.value >= CORRECT_THRESHOLD) {
	// 		return correct + 1;
	// 	} else {
	// 		return correct;
	// 	}
	// }, 0);
</script>

<div class="container">
	<div class="row mt-4">
		<div class="col-6">
			<span>
				<span class="linkArrow"> &lt; </span>
				<a class="link-dark" href={`${base}/${lessonBlock.lesson.url}`}> Stop Lesson </a>
			</span>
		</div>
	</div>
	<div class="row mb-5">
		<div class="col">
			{#if lessonBlock}
				<div id="lessonBlock-content" data-lessonBlock-id={lessonBlock.id}>
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
