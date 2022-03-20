<script lang="ts">
	import MultipleChoiceInput from './MultipleChoiceInput.svelte';
	import MultipleChoiceContent from './MultipleChoiceContent.svelte';
	import Review from './Review.svelte';
	import type { Result } from '@prisma/client';
	import type { MultipleChoicePrivate, MultipleChoiceAnswer } from '$lib/types';
	import RichViewer from '../Editor/RichViewer.svelte';

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
	<div name="explanation" slot="explanation">
		{#if prompt.explanation && prompt.explanation.length}
			<hr />
			<div class="px-4">
				<h1>Explanation</h1>
				<RichViewer value={prompt.explanation} />
			</div>
		{/if}
	</div>
</Review>
