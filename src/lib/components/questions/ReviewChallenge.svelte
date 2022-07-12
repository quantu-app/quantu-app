<svelte:options immutable />

<script lang="ts">
	import type { Result } from '@prisma/client';
	import FlashCardReview from './FlashCardReview.svelte';
	import InputReview from './InputReview.svelte';
	import MarkAsReadReview from './MarkAsReadReview.svelte';
	import MultipleChoiceReview from './multiple_choice/MultipleChoiceReview.svelte';
	import Stats from '../challenges/Stats.svelte';

	export let result: Result;
	export let seed: number | undefined = undefined;
</script>

<div class="stats">
	<Stats totalSolvers={20} correct={15} />
</div>

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

<style>
	.stats {
		position: absolute;
		right: 0;
		top: 80px;
		z-index: 1;
	}
</style>
