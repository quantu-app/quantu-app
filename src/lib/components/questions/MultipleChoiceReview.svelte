<script lang="ts">
	import MultipleChoiceInput from './MultipleChoiceInput.svelte';
	import MultipleChoiceContent from './MultipleChoiceContent.svelte';
	import Review from './Review.svelte';
	import type { Result } from '@prisma/client';
	import type { MultipleChoicePrivate, MultipleChoiceAnswer } from '$lib/types';

	export let result: Result;
	export let seed: number = undefined;

	$: prompt = result.prompt as unknown as MultipleChoicePrivate;
	$: input = result.answer as MultipleChoiceAnswer;
	$: correct = prompt.choices.reduce((correct, choice) => {
		if (choice.correct) {
			correct[choice.id] = true;
		}
		return correct;
	}, {} as Record<string, true>);
	$: console.log(correct);
</script>

<Review>
	<MultipleChoiceContent slot="content" {prompt} />
	<MultipleChoiceInput
		slot="input"
		disabled={true}
		{correct}
		{seed}
		{prompt}
		{input}
		reviewMode={true}
	/>
	<slot slot="extra" name="extra" />
</Review>
