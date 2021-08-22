<script lang="ts">
	import type { Question } from '$lib/api/quantu-app-api';
	import FlashCard from './FlashCard.svelte';
	import MultipleChoice from './MultipleChoice.svelte';

	export let question: Question;
	export let answered = false;
	export let result: number | undefined = undefined;
</script>

<div class="container h-100">
	{#if question.type == 'flash_card'}
		<FlashCard {question} bind:answered bind:result>
			<slot slot="extra" name="extra" />
		</FlashCard>
	{:else if question.type == 'multiple_choice'}
		<MultipleChoice {question} bind:answered bind:result>
			<slot slot="extra" name="extra" />
		</MultipleChoice>
	{/if}
</div>
