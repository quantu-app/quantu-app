<script lang="ts">
	import type { QuestionResult } from '$lib/api/quantu-app-api';
	import FlashCardReview from './FlashCardReview.svelte';
	import MultipleChoiceReview from './MultipleChoiceReview.svelte';

	export let result: QuestionResult;
	export let seed: number = undefined;
</script>

{#key result.id}
	{#if result.type == 'flash_card'}
		<FlashCardReview bind:result>
			<slot slot="extra" name="extra" />
		</FlashCardReview>
	{:else if result.type == 'multiple_choice'}
		<MultipleChoiceReview {seed} bind:result>
			<slot slot="extra" name="extra" />
		</MultipleChoiceReview>
	{/if}
{/key}
