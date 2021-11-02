<script lang="ts">
	import type {
		Question,
		QuestionInput,
		QuestionInputPrivate,
		QuestionResult,
		InputAnswer
	} from '$lib/api/quantu-app-api';
	import Prompt from './Prompt.svelte';
	import InputContent from './InputContent.svelte';
	import InputInput from './InputInput.svelte';

	export let question: Question;
	export let seed: number = undefined;
	export let result: QuestionResult = undefined;
	export let input: string[] = [];

	let showExplanation = false;
	$: prompt = question.prompt as QuestionInput;
	$: resultPrompt = result?.prompt as QuestionInput | undefined;
	$: correct = result ? result.result === 1 : undefined;
</script>

<Prompt {question} {input} bind:showExplanation bind:result>
	<InputContent slot="content" {prompt} {showExplanation} explanation={resultPrompt?.explanation} />
	<InputInput slot="input" disabled={result != null} {correct} {prompt} bind:input />
	<slot slot="extra" name="extra" />
</Prompt>
