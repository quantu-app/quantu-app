<script lang="ts">
	import type {
		QuestionResult,
		FlashCardAnswer,
		QuestionFlashCardPrivate
	} from '$lib/api/quantu-app-api';
	import FlashCardInput from './FlashCardInput.svelte';
	import FlashCardContent from './FlashCardContent.svelte';

	export let result: QuestionResult;

	$: prompt = result.prompt as QuestionFlashCardPrivate;
	$: input = result.answer.input as FlashCardAnswer;
</script>

<FlashCardContent shown {prompt} />
<FlashCardInput shown disabled={true} {input} />
