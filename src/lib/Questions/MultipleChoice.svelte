<script lang="ts">
	import type {
		Question,
		QuestionMultipleChoice,
		QuestionMultipleChoicePrivate,
		QuestionResult
	} from '$lib/api/quantu-app-api';
	import Prompt from './Prompt.svelte';
	import MultipleChoiceContent from './MultipleChoiceContent.svelte';
	import MultipleChoiceInput from './MultipleChoiceInput.svelte';

	export let question: Question;
	export let seed: number = undefined;
	export let result: QuestionResult = undefined;
	export let input: string[] = [];

	let correct: Record<string, true>;
	$: prompt = question.prompt as QuestionMultipleChoice;
	$: if (result) {
		const resultPrompt = result.prompt as QuestionMultipleChoicePrivate;

		correct = Object.entries(resultPrompt.choices || {}).reduce((correct, [key, choice]) => {
			if (choice.correct) {
				correct[key] = true;
			}
			return correct;
		}, {});
	}
</script>

<Prompt {question} {input} bind:result>
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
</Prompt>
