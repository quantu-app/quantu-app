<svelte:options immutable />

<script lang="ts">
	import Prompt from './Prompt.svelte';
	import FlashCardContent from './FlashCardContent.svelte';
	import FlashCardInput from './FlashCardInput.svelte';
	import type { QuestionType, Result } from '@prisma/client';
	import type { Answer, FlashCard, FlashCardAnswer } from '$lib/types';

	export let type: QuestionType;
	export let prompt: FlashCard;
	export let input: FlashCardAnswer | undefined = undefined;
	export let result: Result | undefined = undefined;
	export let showExplanation = false;
	export let onExplain: () => Promise<Result>;
	export let onSubmit: (answer: Answer) => Promise<Result>;
	export let disabled = false;
</script>

<Prompt {type} {input} bind:result {showExplanation} {disabled} {onExplain} {onSubmit}>
	<FlashCardContent slot="content" {prompt} />
	<FlashCardInput slot="input" disabled={disabled || result != null} bind:input />
	<slot slot="extra" name="extra" />
</Prompt>
