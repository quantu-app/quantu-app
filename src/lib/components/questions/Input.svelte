<script lang="ts">
	import Prompt from './Prompt.svelte';
	import InputContent from './InputContent.svelte';
	import InputInput from './InputInput.svelte';
	import type { Answer, Input, InputAnswer, InputPrivate } from '$lib/types';
	import type { QuestionType, Result } from '@prisma/client';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';

	export let type: QuestionType;
	export let input: InputAnswer;
	export let prompt: Input;
	export let result: Result = undefined;
	export let onExplain: () => Promise<Result>;
	export let onSubmit: (answer: Answer) => Promise<Result>;

	let showExplanation = false;
	$: resultPrompt = result?.prompt as unknown as InputPrivate;
	$: correct = result ? result.value >= 0.5 : undefined;
</script>

<Prompt {type} {input} bind:result bind:showExplanation {onExplain} {onSubmit}>
	<InputContent slot="content" {prompt} />
	<InputInput slot="input" disabled={result != null} type={prompt.type} {correct} bind:input />
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
