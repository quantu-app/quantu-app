<script lang="ts">
	import type { Question, QuestionResult } from '$lib/api/quantu-app-api';
	import FlashCard from './FlashCard.svelte';
	import Input from './Input.svelte';
	import MultipleChoice from './MultipleChoice.svelte';

	export let question: Question;
	export let seed: number = undefined;
	export let result: QuestionResult = undefined;

	let prevQuesion: Question;

	$: if (prevQuesion !== question) {
		prevQuesion = question;
		result = undefined;
	}
</script>

{#key question.id}
	{#if question.type == 'flash_card'}
		<FlashCard {question} bind:result>
			<slot slot="extra" name="extra" />
		</FlashCard>
	{:else if question.type == 'multiple_choice'}
		<MultipleChoice {question} {seed} bind:result>
			<slot slot="extra" name="extra" />
		</MultipleChoice>
	{:else if question.type == 'input'}
		<Input {question} {seed} bind:result>
			<slot slot="extra" name="extra" />
		</Input>
	{/if}
{/key}
