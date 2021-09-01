<script lang="ts">
	import type {
		QuestionResult,
		FlashCardAnswer,
		QuestionFlashCardPrivate
	} from '$lib/api/quantu-app-api';
	import FlashCardInput from './FlashCardInput.svelte';
	import FlashCardContent from './FlashCardContent.svelte';
	import Review from './Review.svelte';

	export let result: QuestionResult;

	$: prompt = result.prompt as QuestionFlashCardPrivate;
	$: input = result.answer.input as FlashCardAnswer;
</script>

<Review bind:result>
	<FlashCardContent slot="content" shown {prompt} />
	<FlashCardInput slot="input" shown disabled={true} {input} />
	<slot slot="extra" name="extra" />
</Review>
