<script lang="ts">
	import InputInput from './InputInput.svelte';
	import InputContent from './InputContent.svelte';
	import Review from './Review.svelte';
	import type { Result } from '@prisma/client';
	import type { InputPrivate, InputAnswer } from '$lib/types';

	export let result: Result;

	$: prompt = result.prompt as unknown as InputPrivate;
	$: input = result.answer as unknown as InputAnswer;
</script>

<Review>
	<InputContent slot="content" {prompt} showExplanation explanation={prompt.explanation} />
	<InputInput
		slot="input"
		disabled={true}
		correct={result.value >= 0.5}
		type={prompt.type}
		{input}
	/>
	<slot slot="extra" name="extra" />
</Review>
