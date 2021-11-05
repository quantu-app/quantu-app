<script lang="ts">
	import type { QuestionResult, InputAnswer, QuestionInputPrivate } from '$lib/api/quantu-app-api';
	import InputInput from './InputInput.svelte';
	import InputContent from './InputContent.svelte';
	import Review from './Review.svelte';

	export let result: QuestionResult;

	$: prompt = result.prompt as QuestionInputPrivate;
	$: input = result.answer.input as InputAnswer;
</script>

<Review bind:result>
	<InputContent slot="content" {prompt} showExplanation explanation={prompt.explanation} />
	<InputInput slot="input" disabled={true} correct={result.result >= 0.5} {prompt} {input} />
	<slot slot="extra" name="extra" />
</Review>
