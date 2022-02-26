<script lang="ts">
	import Prompt from './Prompt.svelte';
	import FlashCardContent from './FlashCardContent.svelte';
	import FlashCardInput from './FlashCardInput.svelte';

	export let question: Question;
	export let result: QuestionResult = undefined;
	export let input: number = undefined;

	$: prompt = question.prompt as QuestionFlashCard;
</script>

<Prompt {question} {input} bind:result>
	<FlashCardContent slot="content" {prompt} />
	<FlashCardInput slot="input" disabled={result != null} bind:input />
	<slot slot="extra" name="extra" />
</Prompt>
