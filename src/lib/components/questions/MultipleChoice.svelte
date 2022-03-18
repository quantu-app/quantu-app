<script lang="ts">
	import RichViewer from '$lib/components/Editor/RichViewer.svelte';
	import Prompt from './Prompt.svelte';
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
	export let input: MultipleChoiceAnswer;
	export let prompt: MultipleChoice;
	export let result: Result = undefined;
	export let seed: number = undefined;
	export let onExplain: () => Promise<Result>;
	export let onSubmit: (answer: Answer) => Promise<Result>;

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

<Prompt {type} {input} bind:showExplanation bind:result {onExplain} {onSubmit}>
	<MultipleChoiceContent slot="content" {prompt} />
	<MultipleChoiceInput
		slot="input"
		disabled={result != null}
		{correct}
		{seed}
		{prompt}
		bind:input
	/>
	<slot slot="extra" name="extra" />
	{#if resultPrompt?.explanation && showExplanation}
		<div class="explanation">
			<RichViewer value={resultPrompt?.explanation} />
		</div>
	{/if}
</Prompt>
