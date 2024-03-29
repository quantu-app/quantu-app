<svelte:options immutable />

<script lang="ts">
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import Prompt from '../Prompt.svelte';
	import MultipleChoiceContent from './MultipleChoiceContent.svelte';
	import MultipleChoiceInput from './MultipleChoiceInput.svelte';
	import type { QuestionType, Result } from '@prisma/client';
	import type {
		MultipleChoicePrivate,
		MultipleChoice,
		MultipleChoiceAnswer,
		Answer
	} from '$lib/types';

	export let type: QuestionType;
	export let prompt: MultipleChoice;
	export let input: MultipleChoiceAnswer = undefined;
	export let result: Result = undefined;
	export let seed: number = undefined;
	export let onExplain: () => Promise<Result>;
	export let onSubmit: (answer: Answer) => Promise<Result>;
	export let disabled = false;

	let showExplanation = false;
	let correct: Record<string, true>;
	$: resultPrompt = result?.prompt as unknown as MultipleChoicePrivate;
	$: if (resultPrompt) {
		correct = (resultPrompt.choices || []).reduce((correct, choice) => {
			if (choice.correct) {
				correct[choice.id] = true;
			}
			return correct;
		}, {});
	}
</script>

<Prompt {type} {input} bind:showExplanation bind:result {disabled} {onExplain} {onSubmit}>
	<MultipleChoiceContent slot="content" {prompt} />
	<MultipleChoiceInput
		slot="input"
		disabled={disabled || result != null}
		{correct}
		{seed}
		{prompt}
		bind:input
	/>
	<slot slot="extra" name="extra" />
	<div name="explanation" slot="explanation">
		{#if showExplanation && resultPrompt?.explanation && resultPrompt?.explanation.length}
			<hr />
			<div class="mb-4">
				<h1>Explanation</h1>
				<RichViewer value={resultPrompt.explanation} />
			</div>
		{/if}
	</div>
</Prompt>
