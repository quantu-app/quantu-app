<script lang="ts">
	import type { Question } from '$lib/api/quantu-app-api';
	import FlashCard from './FlashCard.svelte';
	import MultipleChoice from './MultipleChoice.svelte';

	export let question: Question;
</script>

<div class="container h-100">
	{#if question.type == 'flash_card'}
		<FlashCard {question} />
	{:else if question.type == 'multiple_choice'}
		<MultipleChoice {question} />
	{/if}
</div>
