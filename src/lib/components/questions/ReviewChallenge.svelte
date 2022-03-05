<script lang="ts">
	import { QuestionType } from '@prisma/client';
	import type { Result } from '@prisma/client';
	import FlashCardReview from './FlashCardReview.svelte';
	import InputReview from './InputReview.svelte';
	import MarkAsReadReview from './MarkAsReadReview.svelte';
	import MultipleChoiceReview from './MultipleChoiceReview.svelte';

	export let result: Result;
	export let seed: number = undefined;
</script>

{#key result.id}
	{#if result.type === QuestionType.FLASH_CARD}
		<FlashCardReview bind:result>
			<slot slot="extra" name="extra" />
		</FlashCardReview>
	{:else if result.type === QuestionType.MULTIPLE_CHOICE}
		<MultipleChoiceReview {seed} bind:result>
			<slot slot="extra" name="extra" />
		</MultipleChoiceReview>
	{:else if result.type === QuestionType.INPUT}
		<InputReview bind:result>
			<slot slot="extra" name="extra" />
		</InputReview>
	{:else if result.type === QuestionType.MARK_AS_READ}
		<MarkAsReadReview bind:result>
			<slot slot="extra" name="extra" />
		</MarkAsReadReview>
	{/if}
{/key}
