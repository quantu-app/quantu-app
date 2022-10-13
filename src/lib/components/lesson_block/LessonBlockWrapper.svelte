<svelte:options immutable />

<script lang="ts">
	import type { StateLessonBlock } from '$lib/state/lessonBlocks';

	export let lessonBlock: StateLessonBlock;
</script>

<div class="container">
	<div class="row mb-5">
		<div class="col">
			{#if lessonBlock}
				<div id="lessonBlock-content" data-lessonBlock-id={lessonBlock.id}>
					<div class="row mt-3 mx-2">
						<div class="col-8 mx-auto">
							<slot />
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
