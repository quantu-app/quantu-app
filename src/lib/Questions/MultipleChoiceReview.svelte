<script lang="ts">
	import type {
		QuestionResult,
		MultipleChoiceAnswer,
		QuestionMultipleChoicePrivate
	} from '$lib/api/quantu-app-api';
	import MultipleChoiceInput from './MultipleChoiceInput.svelte';
	import MultipleChoiceContent from './MultipleChoiceContent.svelte';
	import Review from './Review.svelte';

	export let result: QuestionResult;
	export let seed: number = undefined;

	$: prompt = result.prompt as QuestionMultipleChoicePrivate;
	$: input = result.answer.input as MultipleChoiceAnswer;
	$: correct = Object.entries(prompt.choices).reduce((correct, [key, choice]) => {
		if (choice.correct) {
			correct[key] = true;
		}
		return correct;
	}, {});
</script>

<Review bind:result>
	<MultipleChoiceContent slot="content" {prompt} />
	<MultipleChoiceInput slot="input" disabled={true} {correct} {seed} {prompt} {input} />
	<slot slot="extra" name="extra" />
</Review>
