<script lang="ts">
	import type { QuestionResult } from '$lib/api/quantu-app-api';
	import FlashCardReview from './FlashCardReview.svelte';
	import InputReview from './InputReview.svelte';
	import MarkAsReadReview from './MarkAsReadReview.svelte';
	import MultipleChoiceReview from './MultipleChoiceReview.svelte';

	export let result: QuestionResult;
	export let seed: number = undefined;
</script>

{result.type}

{#key result.id}
	{#if result.type == 'flash_card'}
		<FlashCardReview bind:result>
			<slot slot="extra" name="extra" />
		</FlashCardReview>
	{:else if result.type == 'multiple_choice'}
		<MultipleChoiceReview {seed} bind:result>
			<slot slot="extra" name="extra" />
		</MultipleChoiceReview>
	{:else if result.type == 'input'}
		<InputReview bind:result>
			<slot slot="extra" name="extra" />
		</InputReview>
	{:else if result.type == 'mark_as_read'}
		<MarkAsReadReview bind:result>
			<slot slot="extra" name="extra" />
		</MarkAsReadReview>
	{/if}
{/key}
