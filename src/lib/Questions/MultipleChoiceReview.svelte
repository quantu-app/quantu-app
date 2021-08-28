<script lang="ts">
	import type {
		QuestionResult,
		MultipleChoiceAnswer,
		QuestionMultipleChoicePrivate
	} from '$lib/api/quantu-app-api';
	import MultipleChoiceInput from './MultipleChoiceInput.svelte';
	import MultipleChoiceContent from './MultipleChoiceContent.svelte';

	export let result: QuestionResult;

	$: prompt = result.prompt as QuestionMultipleChoicePrivate;
	$: input = result.answer.input as MultipleChoiceAnswer;
	$: correct = Object.entries(prompt.choices).reduce((correct, [key, choice]) => {
		if (choice.correct) {
			correct[key] = true;
		}
		return correct;
	}, {});
</script>

<MultipleChoiceContent {prompt} />
<MultipleChoiceInput disabled={true} {correct} seed={undefined} {prompt} {input} />
