<svelte:options immutable />

<script lang="ts">
	import type { Result } from '@prisma/client';
	import FlashCardReview from '../questions/FlashCardReview.svelte';
	import InputReview from '../questions/InputReview.svelte';
	import MarkAsReadReview from '../questions/MarkAsReadReview.svelte';
	import MultipleChoiceReview from '../questions/multiple_choice/MultipleChoiceReview.svelte';

	export let result: Result;
	export let seed: number | undefined = undefined;
</script>

{#key result.id}
	{#if result.type === 'FLASH_CARD'}
		<FlashCardReview bind:result>
			<slot slot="extra" name="extra" />
		</FlashCardReview>
	{:else if result.type === 'MULTIPLE_CHOICE'}
		<MultipleChoiceReview {seed} bind:result>
			<slot slot="extra" name="extra" />
		</MultipleChoiceReview>
	{:else if result.type === 'INPUT'}
		<InputReview bind:result>
			<slot slot="extra" name="extra" />
		</InputReview>
	{:else if result.type === 'MARK_AS_READ'}
		<MarkAsReadReview bind:result>
			<slot slot="extra" name="extra" />
		</MarkAsReadReview>
	{/if}
{/key}
